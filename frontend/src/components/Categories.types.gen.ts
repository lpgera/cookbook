import * as Types from '../graphql.types.gen'

export type CategoriesQueryVariables = Types.Exact<{ [key: string]: never }>

export type CategoriesQuery = {
  __typename?: 'Query'
  categories: Array<string>
}
