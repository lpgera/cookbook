import { GraphQLScalarType, Kind } from 'graphql'
import jwt from 'jsonwebtoken'
import { sql } from 'kysely'
import db from '../kysely/db.ts'
import type { IngredientGroupInput, Resolvers } from './resolvers.gen.ts'

async function insertIngredientsAndGroups({
  recipeId,
  ingredientGroups,
  trx,
}: {
  recipeId: number
  ingredientGroups: IngredientGroupInput[]
  trx: typeof db
}) {
  for (const group of ingredientGroups) {
    const insertedGroup = await trx
      .insertInto('IngredientGroup')
      .values({
        name: group.name,
        recipeId,
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
          selectFrom('RecipeCategory')
            .selectAll()
            .whereRef('RecipeCategory.categoryId', '=', 'Category.id')
        )
      )
    )
    .execute()

const toContainsPattern = (query: string) =>
  `%${query.replace(/[\\%_]/g, '\\$&')}%`

async function upsertRecipeCategories({
  recipeId,
  categories,
  trx,
}: {
  recipeId: number
  categories: string[]
  trx: typeof db
}) {
  for (const categoryName of categories) {
    const existingCategory = await trx
      .selectFrom('Category')
      .selectAll()
      .where('name', '=', categoryName)
      .executeTakeFirst()

    if (existingCategory) {
      await trx
        .insertInto('RecipeCategory')
        .values({
          categoryId: existingCategory.id,
          recipeId,
        })
        .execute()
    } else {
      const newCategory = await trx
        .insertInto('Category')
        .values({
          name: categoryName,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('RecipeCategory')
        .values({
          categoryId: newCategory.id,
          recipeId,
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
        .orderBy('order', 'asc')
        .execute(),
  },
  Recipe: {
    ingredientGroups: async ({ id: recipeId }) =>
      db
        .selectFrom('IngredientGroup')
        .selectAll()
        .where('recipeId', '=', recipeId)
        .orderBy('id', 'asc')
        .execute(),
    categories: async ({ id: recipeId }) => {
      const categories = await db
        .selectFrom('Category')
        .innerJoin('RecipeCategory', 'RecipeCategory.categoryId', 'Category.id')
        .select('Category.name')
        .where('RecipeCategory.recipeId', '=', recipeId)
        .execute()
      return categories.map((c) => c.name)
    },
  },
  Query: {
    recipes: (_, { ids, category }) => {
      const baseQuery = db
        .selectFrom('Recipe')
        .selectAll('Recipe')
        .orderBy('Recipe.name', 'asc')

      const queryFilteredByIds = ids?.length
        ? baseQuery.where('Recipe.id', 'in', ids)
        : baseQuery

      const queryFilteredByCategory = category
        ? queryFilteredByIds
            .innerJoin('RecipeCategory', 'RecipeCategory.recipeId', 'Recipe.id')
            .innerJoin('Category', 'Category.id', 'RecipeCategory.categoryId')
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
      const pattern = toContainsPattern(query)

      return db
        .selectFrom('Recipe')
        .selectAll('Recipe')
        .where((eb) =>
          eb.or([
            eb('Recipe.name', 'ilike', pattern),
            eb.exists(
              eb
                .selectFrom('Ingredient')
                .innerJoin(
                  'IngredientGroup',
                  'IngredientGroup.id',
                  'Ingredient.groupId'
                )
                .select('Ingredient.id')
                .whereRef('IngredientGroup.recipeId', '=', 'Recipe.id')
                .where('Ingredient.name', 'ilike', pattern)
            ),
          ])
        )
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
        const insertedRecipe = await trx
          .insertInto('Recipe')
          .values({
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
          })
          .returningAll()
          .executeTakeFirstOrThrow()

        await insertIngredientsAndGroups({
          recipeId: insertedRecipe.id,
          ingredientGroups: recipe.ingredientGroups,
          trx,
        })

        await upsertRecipeCategories({
          recipeId: insertedRecipe.id,
          categories: recipe.categories,
          trx,
        })

        return insertedRecipe
      }),
    updateRecipe: async (_, { id: recipeId, recipe }) =>
      db.transaction().execute(async (trx) => {
        await trx
          .deleteFrom('IngredientGroup')
          .where('recipeId', '=', recipeId)
          .execute()

        await trx
          .deleteFrom('RecipeCategory')
          .where('recipeId', '=', recipeId)
          .execute()

        const updatedRecipe = await trx
          .updateTable('Recipe')
          .where('id', '=', recipeId)
          .set({
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .returningAll()
          .executeTakeFirstOrThrow()

        await insertIngredientsAndGroups({
          recipeId,
          ingredientGroups: recipe.ingredientGroups,
          trx,
        })

        await upsertRecipeCategories({
          recipeId,
          categories: recipe.categories,
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
