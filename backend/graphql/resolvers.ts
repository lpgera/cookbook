import { Ingredient, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// TODO use graphql-codegen to generate these types
type RecipeInput = {
  name: string
  description?: string
  instructions?: string
}

type IngredientInput = {
  name: string
  amount: string
}

enum IngredientMoveDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

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
          ingredients: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      })
    },
    recipe: (_: never, { id }: { id: number }) => {
      return prisma.recipe.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          ingredients: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      })
    },
  },
  Mutation: {
    addRecipe(_: never, { recipe }: { recipe: RecipeInput }) {
      return prisma.recipe.create({
        data: recipe,
      })
    },
    updateRecipe(
      _: never,
      { id, recipe }: { id: number; recipe: RecipeInput }
    ) {
      return prisma.recipe.update({
        where: {
          id,
        },
        data: recipe,
      })
    },
    deleteRecipe(_: never, { id }: { id: number }) {
      return prisma.recipe.delete({
        where: {
          id,
        },
        include: {
          ingredients: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      })
    },
    async addIngredient(
      _: never,
      {
        recipeId,
        ingredient,
      }: { recipeId: number; ingredient: IngredientInput }
    ) {
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
        include: {
          recipe: true,
        },
      })
    },
    updateIngredient(
      _: never,
      { id, ingredient }: { id: number; ingredient: IngredientInput }
    ) {
      return prisma.ingredient.update({
        where: {
          id,
        },
        data: ingredient,
        include: {
          recipe: true,
        },
      })
    },
    deleteIngredient(_: never, { id }: { id: number }) {
      return prisma.ingredient.delete({
        where: {
          id,
        },
        include: {
          recipe: true,
        },
      })
    },
    async moveIngredient(
      _: never,
      { id, direction }: { id: number; direction: IngredientMoveDirection }
    ) {
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

      if (direction === IngredientMoveDirection.UP && index > 0) {
        await swapIngredients(ingredients, index - 1, index)
      }
      if (
        direction === IngredientMoveDirection.DOWN &&
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
}
