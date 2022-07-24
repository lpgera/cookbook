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

  input RecipeInput {
    name: String!
    description: String
    instructions: String
  }

  input IngredientInput {
    name: String!
    amount: String!
  }

  enum IngredientMoveDirection {
    UP
    DOWN
  }

  type Mutation {
    addRecipe(recipe: RecipeInput): Recipe!
    updateRecipe(id: Int!, recipe: RecipeInput): Recipe!
    deleteRecipe(id: Int!): Recipe!
    addIngredient(recipeId: Int!, ingredient: IngredientInput!): Ingredient!
    updateIngredient(id: Int!, ingredient: IngredientInput!): Ingredient!
    deleteIngredient(id: Int!): Ingredient!
    moveIngredient(id: Int!, direction: IngredientMoveDirection!): Ingredient!
  }
`
