import * as Types from '../graphql.types.gen'

export type ShoppingListQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['Int']['input']> | Types.Scalars['Int']['input']
}>

export type ShoppingListQuery = {
  __typename?: 'Query'
  recipes: Array<{
    __typename?: 'Recipe'
    id: number
    name: string
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
