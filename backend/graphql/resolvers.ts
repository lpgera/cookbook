import { PrismaClient } from '@prisma/client'
import { GraphQLScalarType, Kind } from 'graphql'
import jwt from 'jsonwebtoken'
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
    categories: async ({ id: recipeId }) => {
      const categories = await prisma.category.findMany({
        where: {
          recipes: {
            some: {
              id: recipeId,
            },
          },
        },
        select: {
          name: true,
        },
      })
      return categories.map((c) => c.name)
    },
  },
  Query: {
    recipes: async () => {
      console.time('recipes')
      const recipes = await prisma.recipe.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      console.timeEnd('recipes')
      return recipes
    },
    recipe: (_, { id }) => {
      return prisma.recipe.findFirstOrThrow({
        where: {
          id,
        },
      })
    },
    categories: async () => {
      const categories = await prisma.category.findMany()
      return categories.map((c) => c.name)
    },
    ingredients: async () => {
      const ingredients = await prisma.ingredient.findMany({
        select: {
          name: true,
        },
        distinct: ['name'],
        orderBy: {
          name: 'asc',
        },
      })
      return ingredients.map((i) => i.name)
    },
    units: async () => {
      const ingredients = await prisma.ingredient.findMany({
        select: {
          unit: true,
        },
        distinct: ['unit'],
        orderBy: {
          unit: 'asc',
        },
      })
      return ingredients.map((i) => i.unit).filter(Boolean)
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
          },
        )
      }
      throw new Error('Invalid password')
    },
    addRecipe: (_, { recipe }) =>
      prisma.recipe.create({
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
          categories: {
            connectOrCreate: recipe.categories.map((name) => ({
              where: { name },
              create: { name },
            })),
          },
        },
      }),
    updateRecipe: async (_, { id: recipeId, recipe }) => {
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
            categories: {
              set: [],
            },
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
            categories: {
              connectOrCreate: recipe.categories.map((name) => ({
                where: { name },
                create: { name },
              })),
            },
          },
        }),
        prisma.$executeRaw`
          delete from "Category" where not exists(
              select * from "_CategoryToRecipe" 
              where "_CategoryToRecipe"."A" = "Category"."id"
          )
        `,
      ])

      return prisma.recipe.findFirstOrThrow({
        where: {
          id: recipeId,
        },
      })
    },
    deleteRecipe: async (_, { id }) => {
      const recipe = await prisma.recipe.delete({
        where: {
          id,
        },
      })

      await prisma.$executeRaw`
        delete from "Category" where not exists(
            select * from "_CategoryToRecipe" 
            where "_CategoryToRecipe"."A" = "Category"."id"
        )
      `

      return recipe
    },
  },
} as Resolvers
