import gql from 'graphql-tag'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { schemaTransformer } from './loggedInDirective'
import resolvers from './resolvers'

const typeDefs = gql`
  directive @loggedIn on FIELD_DEFINITION | MUTATION

  scalar Date

  type Recipe {
    id: Int!
    createdAt: Date!
    updatedAt: Date!
    name: String!
    description: String!
    instructions: String!
    ingredientGroups: [IngredientGroup!]!
    categories: [String!]!
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
    recipes(ids: [Int!], category: String): [Recipe!]! @loggedIn
    recipe(id: Int!): Recipe! @loggedIn
    categories: [String!]! @loggedIn
    ingredients: [String!]! @loggedIn
    units: [String!]! @loggedIn
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
    categories: [String!]!
    instructions: String!
    ingredientGroups: [IngredientGroupInput!]!
  }

  type Mutation {
    login(password: String!): String!
    addRecipe(recipe: RecipeInput!): Recipe! @loggedIn
    updateRecipe(id: Int!, recipe: RecipeInput!): Recipe! @loggedIn
    deleteRecipe(id: Int!): Recipe! @loggedIn
  }
`

const schema = schemaTransformer(
  makeExecutableSchema({
    resolvers,
    typeDefs,
  })
)

export default schema
