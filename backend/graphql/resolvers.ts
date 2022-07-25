import { Ingredient, PrismaClient } from '@prisma/client'
import { GraphQLScalarType, Kind } from 'graphql'
import { IngredientMoveDirection, Resolvers } from './resolvers.gen'

const prisma = new PrismaClient()

async function swapIngredients(
  ingredients: Ingredient[],
  i1: number,
  i2: number
) {
  const [ingredient1, ingredient2] = ingredients.slice(i1, i2 + 1)

  await prisma.$transaction([
    prisma.ingredient.update({
      where: {
        id: ingredient1.id,
      },
      data: {
        order: ingredient2.order,
      },
    }),
    prisma.ingredient.update({
      where: {
        id: ingredient2.id,
      },
      data: {
        order: ingredient1.order,
      },
    }),
  ])
}

export default {
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
    recipe: ({ recipeId: id }) => {
      return prisma.recipe.findFirstOrThrow({
        where: {
          id,
        },
      })
    },
  },
  Recipe: {
    ingredients({ id: recipeId }) {
      return prisma.ingredient.findMany({
        where: {
          recipeId,
        },
        orderBy: {
          order: 'asc',
        },
      })
    },
  },
  Query: {
    recipes: () => {
      return prisma.recipe.findMany()
    },
    recipe: (_, { id }) => {
      return prisma.recipe.findFirstOrThrow({
        where: {
          id,
        },
      })
    },
  },
  Mutation: {
    addRecipe(_, { recipe }) {
      return prisma.recipe.create({
        data: recipe,
      })
    },
    updateRecipe(_, { id, recipe }) {
      return prisma.recipe.update({
        where: {
          id,
        },
        data: recipe,
      })
    },
    deleteRecipe(_, { id }) {
      return prisma.recipe.delete({
        where: {
          id,
        },
      })
    },
    async addIngredient(_, { recipeId, ingredient }) {
      const {
        _max: { order: maxOrder },
      } = await prisma.ingredient.aggregate({
        where: {
          recipeId,
        },
        _max: {
          order: true,
        },
      })
      const order = (maxOrder ?? 0) + 1

      return prisma.ingredient.create({
        data: {
          recipeId,
          order,
          ...ingredient,
        },
      })
    },
    updateIngredient(_, { id, ingredient }) {
      return prisma.ingredient.update({
        where: {
          id,
        },
        data: ingredient,
      })
    },
    deleteIngredient(_, { id }) {
      return prisma.ingredient.delete({
        where: {
          id,
        },
      })
    },
    async moveIngredient(_, { id, direction }) {
      const { recipeId } = await prisma.ingredient.findFirstOrThrow({
        where: {
          id,
        },
        select: {
          recipeId: true,
        },
      })

      const ingredients = await prisma.ingredient.findMany({
        where: {
          recipeId,
        },
        orderBy: {
          order: 'asc',
        },
      })

      const index = ingredients.findIndex(({ id: _id }) => _id === id)

      if (direction === IngredientMoveDirection.Up && index > 0) {
        await swapIngredients(ingredients, index - 1, index)
      }
      if (
        direction === IngredientMoveDirection.Down &&
        index < ingredients.length - 1
      ) {
        await swapIngredients(ingredients, index, index + 1)
      }

      return prisma.ingredient.findFirstOrThrow({
        where: {
          id,
        },
      })
    },
  },
} as Resolvers
