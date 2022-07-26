import * as Types from '../graphql.types.gen'

export type RecipesQueryVariables = Types.Exact<{ [key: string]: never }>

export type RecipesQuery = {
  __typename?: 'Query'
  recipes: Array<{ __typename?: 'Recipe'; id: number; name: string }>
}
