import { PrismaClient } from '@prisma/client'
import { GraphQLScalarType, Kind } from 'graphql'
import jwt from 'jsonwebtoken'
import { Resolvers } from './resolvers.gen'

const prisma = new PrismaClient()

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
      return prisma.ingredientGroup.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
  },
  IngredientGroup: {
    recipe: ({ recipeId: id }) => {
      return prisma.recipe.findUniqueOrThrow({
        where: {
          id,
        },
      })
    },
    ingredients: async ({ id: groupId }) => {
      return (
        (await prisma.ingredientGroup
          .findUnique({
            where: {
              id: groupId,
            },
          })
          .ingredients()) || []
      )
    },
  },
  Recipe: {
    ingredientGroups: async ({ id: recipeId }) => {
      return (
        (await prisma.recipe
          .findUnique({ where: { id: recipeId } })
          .ingredientGroups()) || []
      )
    },
    categories: async ({ id: recipeId }) => {
      const categories =
        (await prisma.recipe
          .findUnique({ where: { id: recipeId } })
          .categories({
            select: {
              name: true,
            },
          })) || []
      return categories.map((c) => c.name)
    },
  },
  Query: {
    recipes: () => {
      return prisma.recipe.findMany({
        orderBy: {
          name: 'asc',
        },
      })
    },
    recipe: (_, { id }) => {
      return prisma.recipe.findUniqueOrThrow({
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

      return prisma.recipe.findUniqueOrThrow({
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
}

export default resolvers
