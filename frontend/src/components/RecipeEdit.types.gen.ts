import * as Types from '../graphql.types.gen'

export type RecipeQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']
}>

export type RecipeQuery = {
  __typename?: 'Query'
  recipe: {
    __typename?: 'Recipe'
    id: number
    name: string
    description: string
    categories: Array<string>
    instructions: string
    ingredientGroups: Array<{
      __typename?: 'IngredientGroup'
      id: number
      name: string
      ingredients: Array<{
        __typename?: 'Ingredient'
        id: number
        name: string
        amount: string
        unit: string
        order: number
      }>
    }>
  }
}

export type UpdateRecipeMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']
  recipe: Types.RecipeInput
}>

export type UpdateRecipeMutation = {
  __typename?: 'Mutation'
  updateRecipe: { __typename?: 'Recipe'; id: number }
}
