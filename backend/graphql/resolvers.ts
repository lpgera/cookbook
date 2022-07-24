import { Ingredient, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default {
  Ingredient: {
    recipe: ({ recipeId }: Ingredient) => {
      return prisma.recipe.findFirstOrThrow({
        where: {
          id: recipeId,
        },
      })
    },
  },
  Query: {
    recipes: () => {
      return prisma.recipe.findMany({
        include: {
          ingredients: true,
        },
      })
    },
    recipe: (_: never, { id }: { id: number }) => {
      return prisma.recipe.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          ingredients: true,
        },
      })
    },
  },
  // Mutation: {},
}
