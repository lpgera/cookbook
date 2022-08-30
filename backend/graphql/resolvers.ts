import { PrismaClient } from '@prisma/client'
import { GraphQLScalarType, Kind } from 'graphql'
import { Resolvers } from './resolvers.gen'

const prisma = new PrismaClient()

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
    ingredients: async () => {
      const ingredients = await prisma.ingredient.findMany({
        select: {
          name: true,
        },
        distinct: ['name'],
      })
      return ingredients.map((i) => i.name)
    },
  },
  Mutation: {
    addRecipe(_, { recipe }) {
      return prisma.recipe.create({
        data: {
          name: recipe.name,
          description: recipe.description,
          instructions: recipe.instructions,
          ingredients: {
            create: recipe.ingredients.map((ingredient, index) => ({
              order: index,
              ...ingredient,
            })),
          },
        },
      })
    },
    async updateRecipe(_, { id: recipeId, recipe }) {
      const existingIngredientIds = (
        await prisma.ingredient.findMany({
          where: {
            recipeId,
          },
          select: {
            id: true,
          },
        })
      ).map(({ id }) => id)
      const newIngredientIds = recipe.ingredients.map(({ id }) => id)
      const ingredientIdsToDelete = existingIngredientIds.filter(
        (existingIngredientId) =>
          !newIngredientIds.includes(existingIngredientId)
      )

      await prisma.$transaction([
        prisma.recipe.update({
          where: {
            id: recipeId,
          },
          data: {
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
          },
        }),
        prisma.ingredient.deleteMany({
          where: {
            id: {
              in: ingredientIdsToDelete,
            },
          },
        }),
        ...recipe.ingredients.map((ingredient, index) => {
          if (ingredient.id) {
            return prisma.ingredient.update({
              where: {
                id: ingredient.id,
              },
              data: {
                id: ingredient.id,
                name: ingredient.name,
                amount: ingredient.amount,
                order: index,
              },
            })
          }
          return prisma.ingredient.create({
            data: {
              recipeId,
              name: ingredient.name,
              amount: ingredient.amount,
              order: index,
            },
          })
        }),
      ])

      return prisma.recipe.findFirstOrThrow({
        where: {
          id: recipeId,
        },
      })
    },
    deleteRecipe(_, { id }) {
      return prisma.recipe.delete({
        where: {
          id,
        },
      })
    },
  },
} as Resolvers
