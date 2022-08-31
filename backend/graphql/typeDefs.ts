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
    ingredientGroups: [IngredientGroup!]!
  }

  type IngredientGroup {
    id: Int!
    createdAt: Date!
    updatedAt: Date!
    recipeId: Int!
    recipe: Recipe!
    name: String!
    ingredients: [Ingredient!]!
  }

  type Ingredient {
    id: Int!
    createdAt: Date!
    updatedAt: Date!
    groupId: Int!
    group: IngredientGroup!
    name: String!
    amount: String!
    unit: String!
    order: Int!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: Int!): Recipe!
    ingredients: [String!]!
    units: [String!]!
  }

  input IngredientInput {
    id: Int
    name: String!
    amount: String!
    unit: String!
  }

  input IngredientGroupInput {
    id: Int
    name: String!
    ingredients: [IngredientInput!]!
  }

  input RecipeInput {
    name: String!
    description: String!
    instructions: String!
    ingredientGroups: [IngredientGroupInput!]!
  }

  type Mutation {
    addRecipe(recipe: RecipeInput!): Recipe!
    updateRecipe(id: Int!, recipe: RecipeInput!): Recipe!
    deleteRecipe(id: Int!): Recipe!
  }
`
