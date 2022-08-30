import * as Types from '../graphql.types.gen'

export type IngredientsQueryVariables = Types.Exact<{ [key: string]: never }>

export type IngredientsQuery = {
  __typename?: 'Query'
  ingredients: Array<string>
}

export type AddRecipeMutationVariables = Types.Exact<{
  recipe: Types.RecipeInput
}>

export type AddRecipeMutation = {
  __typename?: 'Mutation'
  addRecipe: { __typename?: 'Recipe'; id: number }
}
