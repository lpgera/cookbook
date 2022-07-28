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
    description?: string | null
    instructions?: string | null
    ingredients: Array<{
      __typename?: 'Ingredient'
      id: number
      name: string
      amount: string
      order: number
    }>
  }
}
