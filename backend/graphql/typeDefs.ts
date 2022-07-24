import { gql } from 'apollo-server'

export default gql`
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
    recipe(id: Int!): Recipe!
  }
`
