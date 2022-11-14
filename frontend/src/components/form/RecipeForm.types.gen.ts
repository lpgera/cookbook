import * as Types from '../../graphql.types.gen'

export type GlobalsQueryVariables = Types.Exact<{ [key: string]: never }>

export type GlobalsQuery = {
  __typename?: 'Query'
  ingredients: Array<string>
  units: Array<string>
  categories: Array<string>
}
