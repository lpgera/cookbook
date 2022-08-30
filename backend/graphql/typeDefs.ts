import { gql } from 'apollo-server'

export default gql`
  scalar Date

  type Recipe {
    id: Int!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    description: String!
    instructions: String!
    ingredients: [Ingredient!]!
  }

  type Ingredient {
    id: Int!
    createdAt: Date!
    updatedAt: Date!
    recipeId: Int!
    recipe: Recipe!
    name: String!
    amount: String!
    order: Int!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: Int!): Recipe!
    ingredients: [String!]!
  }

  input IngredientInput {
    id: Int
    name: String!
    amount: String!
  }

  input RecipeInput {
    name: String!
    description: String!
    instructions: String!
    ingredients: [IngredientInput!]!
  }

  type Mutation {
    addRecipe(recipe: RecipeInput!): Recipe!
    updateRecipe(id: Int!, recipe: RecipeInput!): Recipe!
    deleteRecipe(id: Int!): Recipe!
  }
`
