import { GraphQLScalarType, Kind } from 'graphql'
import jwt from 'jsonwebtoken'
import db from '../kysely/db.ts'
import type { IngredientGroupInput, Resolvers } from './resolvers.gen.ts'

async function insertIngredientsAndGroups({
  recipeId,
  ingredientGroups,
  date,
  trx,
}: {
  recipeId: number
  ingredientGroups: IngredientGroupInput[]
  date: Date
  trx: typeof db
}) {
  for (const group of ingredientGroups) {
    const insertedGroup = await trx
      .insertInto('IngredientGroup')
      .values({
        name: group.name,
        recipeId,
        updatedAt: date,
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    await trx
      .insertInto('Ingredient')
      .values(
        group.ingredients.map((ingredient, index) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          order: index,
          groupId: insertedGroup.id,
          updatedAt: date,
        }))
      )
      .execute()
  }
}

const deleteOrphanCategories = ({ trx }: { trx: typeof db }) =>
  trx
    .deleteFrom('Category')
    .where(({ not, exists, selectFrom }) =>
      not(
        exists(
          selectFrom('_CategoryToRecipe')
            .selectAll()
            .whereRef('_CategoryToRecipe.A', '=', 'Category.id')
        )
      )
    )
    .execute()

async function upsertRecipeCategories({
  recipeId,
  categories,
  trx,
  date,
}: {
  recipeId: number
  categories: string[]
  trx: typeof db
  date: Date
}) {
  for (const categoryName of categories) {
    const existingCategory = await trx
      .selectFrom('Category')
      .selectAll()
      .where('name', '=', categoryName)
      .executeTakeFirst()

    if (existingCategory) {
      await trx
        .insertInto('_CategoryToRecipe')
        .values({
          A: existingCategory.id,
          B: recipeId,
        })
        .execute()
    } else {
      const newCategory = await trx
        .insertInto('Category')
        .values({
          name: categoryName,
          updatedAt: date,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('_CategoryToRecipe')
        .values({
          A: newCategory.id,
          B: recipeId,
        })
        .execute()
    }
  }
}

const resolvers: Resolvers = {
  Date: new GraphQLScalarType<Date, string>({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value as string)
    },
    serialize(value) {
      return new Date(value as string).toISOString()
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value)
      }
      return new Date()
    },
  }),
  Ingredient: {
    group: ({ groupId: id }) => {
      return db
        .selectFrom('IngredientGroup')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()
    },
  },
  IngredientGroup: {
    recipe: ({ recipeId: id }) =>
      db
        .selectFrom('Recipe')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow(),
    ingredients: async ({ id: groupId }) =>
      db
        .selectFrom('Ingredient')
        .selectAll()
        .where('groupId', '=', groupId)
        .execute(),
  },
  Recipe: {
    ingredientGroups: async ({ id: recipeId }) =>
      db
        .selectFrom('IngredientGroup')
        .selectAll()
        .where('recipeId', '=', recipeId)
        .execute(),
    categories: async ({ id: recipeId }) => {
      const categories = await db
        .selectFrom('Category')
        .innerJoin('_CategoryToRecipe', '_CategoryToRecipe.A', 'Category.id')
        .select('Category.name')
        .where('_CategoryToRecipe.B', '=', recipeId)
        .execute()
      return categories.map((c) => c.name)
    },
  },
  Query: {
    recipes: (_, { ids, category }) => {
      const baseQuery = db
        .selectFrom('Recipe')
        .selectAll('Recipe')
        .orderBy('name', 'asc')

      const queryFilteredByIds = ids?.length
        ? baseQuery.where('id', 'in', ids)
        : baseQuery

      const queryFilteredByCategory = category
        ? queryFilteredByIds
            .innerJoin('_CategoryToRecipe', '_CategoryToRecipe.B', 'Recipe.id')
            .innerJoin('Category', 'Category.id', '_CategoryToRecipe.A')
            .where('Category.name', '=', category)
        : queryFilteredByIds

      return queryFilteredByCategory.distinct().execute()
    },
    recipe: (_, { id }) =>
      db
        .selectFrom('Recipe')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow(),
    categories: async () => {
      const categories = await db
        .selectFrom('Category')
        .select('name')
        .orderBy('name', 'asc')
        .execute()
      return categories.map((c) => c.name)
    },
    ingredients: async () => {
      const ingredients = await db
        .selectFrom('Ingredient')
        .select('name')
        .distinct()
        .orderBy('name', 'asc')
        .execute()
      return ingredients.map((i) => i.name)
    },
    units: async () => {
      const ingredients = await db
        .selectFrom('Ingredient')
        .select('unit')
        .distinct()
        .orderBy('unit', 'asc')
        .execute()
      return ingredients.map((i) => i.unit).filter(Boolean)
    },
    search: async (_, { query }) => {
      return db
        .selectFrom('Recipe')
        .selectAll('Recipe')
        .innerJoin('IngredientGroup', 'IngredientGroup.recipeId', 'Recipe.id')
        .innerJoin('Ingredient', 'Ingredient.groupId', 'IngredientGroup.id')
        .where((eb) =>
          eb(
            eb.fn<string>(`LOWER`, ['Recipe.name']),
            'like',
            `%${query.toLowerCase()}%`
          ).or(
            eb.fn<string>(`LOWER`, ['Ingredient.name']),
            'like',
            `%${query.toLowerCase()}%`
          )
        )
        .distinct()
        .orderBy('Recipe.name', 'asc')
        .execute()
    },
  },
  Mutation: {
    login: (_, { password }) => {
      if (process.env.JWT_SECRET && password === process.env.PASSWORD) {
        return jwt.sign(
          {
            token: 'cookbook',
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRY ?? '7 day',
          }
        )
      }
      throw new Error('Invalid password')
    },
    addRecipe: (_, { recipe }) =>
      db.transaction().execute(async (trx) => {
        const date = new Date()
        const insertedRecipe = await trx
          .insertInto('Recipe')
          .values({
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
            updatedAt: date,
          })
          .returningAll()
          .executeTakeFirstOrThrow()

        await insertIngredientsAndGroups({
          recipeId: insertedRecipe.id,
          ingredientGroups: recipe.ingredientGroups,
          date,
          trx,
        })

        await upsertRecipeCategories({
          recipeId: insertedRecipe.id,
          categories: recipe.categories,
          date,
          trx,
        })

        return insertedRecipe
      }),
    updateRecipe: async (_, { id: recipeId, recipe }) =>
      db.transaction().execute(async (trx) => {
        const date = new Date()

        await trx
          .deleteFrom('IngredientGroup')
          .where('recipeId', '=', recipeId)
          .execute()

        await trx
          .deleteFrom('_CategoryToRecipe')
          .where('B', '=', recipeId)
          .execute()

        const updatedRecipe = await trx
          .updateTable('Recipe')
          .where('id', '=', recipeId)
          .set({
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
            updatedAt: date,
          })
          .returningAll()
          .executeTakeFirstOrThrow()

        await insertIngredientsAndGroups({
          recipeId,
          ingredientGroups: recipe.ingredientGroups,
          date,
          trx,
        })

        await upsertRecipeCategories({
          recipeId,
          categories: recipe.categories,
          date,
          trx,
        })

        await deleteOrphanCategories({ trx })

        return updatedRecipe
      }),
    deleteRecipe: async (_, { id }) => {
      await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('Recipe').where('id', '=', id).execute()

        await deleteOrphanCategories({ trx })
      })
    },
  },
}

export default resolvers
