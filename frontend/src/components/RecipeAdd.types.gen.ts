import * as Types from '../graphql.types.gen'

export type AddRecipeMutationVariables = Types.Exact<{
  recipe: Types.RecipeInput
}>

export type AddRecipeMutation = {
  __typename?: 'Mutation'
  addRecipe: { __typename?: 'Recipe'; id: number }
}
