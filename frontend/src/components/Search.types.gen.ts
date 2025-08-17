import * as Types from '../graphql.types.gen'

export type SearchQueryVariables = Types.Exact<{
  query: Types.Scalars['String']['input']
}>

export type SearchQuery = {
  __typename?: 'Query'
  search: Array<{
    __typename?: 'Recipe'
    id: number
    name: string
    description: string
    categories: Array<string>
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
      }>
    }>
  }>
}
