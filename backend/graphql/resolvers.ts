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
    group: ({ groupId: id }) => {
      return prisma.ingredientGroup.findFirstOrThrow({
        where: {
          id,
        },
      })
    },
  },
  IngredientGroup: {
    recipe: ({ recipeId: id }) => {
      return prisma.recipe.findFirstOrThrow({
        where: {
          id,
        },
      })
    },
    ingredients: ({ id: groupId }) => {
      return prisma.ingredient.findMany({
        where: {
          groupId,
        },
      })
    },
  },
  Recipe: {
    ingredientGroups({ id: recipeId }) {
      return prisma.ingredientGroup.findMany({
        where: {
          recipeId,
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
    units: async () => {
      const ingredients = await prisma.ingredient.findMany({
        select: {
          unit: true,
        },
        distinct: ['unit'],
      })
      return ingredients.map((i) => i.unit)
    },
  },
  Mutation: {
    addRecipe(_, { recipe }) {
      return prisma.recipe.create({
        data: {
          name: recipe.name,
          description: recipe.description,
          instructions: recipe.instructions,
          ingredientGroups: {
            create: recipe.ingredientGroups.map((group) => ({
              ...group,
              ingredients: {
                create: group.ingredients.map((ingredient, index) => ({
                  ...ingredient,
                  order: index,
                })),
              },
            })),
          },
        },
      })
    },
    async updateRecipe(_, { id: recipeId, recipe }) {
      await prisma.$transaction([
        prisma.ingredientGroup.deleteMany({
          where: {
            recipeId,
          },
        }),
        prisma.recipe.update({
          where: {
            id: recipeId,
          },
          data: {
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
            ingredientGroups: {
              create: recipe.ingredientGroups.map((group) => ({
                ...group,
                ingredients: {
                  create: group.ingredients.map((ingredient, index) => ({
                    ...ingredient,
                    order: index,
                  })),
                },
              })),
            },
          },
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
