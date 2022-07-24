import { PrismaClient } from '@prisma/client'
import type { Ingredient } from '@prisma/client'
import { ApolloServer, gql } from 'apollo-server'

const prisma = new PrismaClient()

const typeDefs = gql`
  type Recipe {
    id: Int!
    createdAt: String!
    updatedAt: String!
    name: String!
    description: String
    instructions: String
    ingredients: [Ingredient!]!
  }

  type Ingredient {
    id: Int!
    createdAt: String!
    updatedAt: String!
    recipe: Recipe!
    name: String!
    amount: String!
    order: Int!
  }

  type Query {
    recipes: [Recipe!]!
  }
`

const resolvers = {
  Ingredient: {
    recipe: ({ recipeId }: Ingredient) => {
      return prisma.recipe.findFirst({
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
  },
}

const server = new ApolloServer({ resolvers, typeDefs })

const port = process.env.PORT ?? 4000

server
  .listen({ port })
  .then(() => {
    console.log(`Server listening on port ${port}`)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
