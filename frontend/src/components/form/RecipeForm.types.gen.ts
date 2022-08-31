import * as Types from '../../graphql.types.gen'

export type IngredientsQueryVariables = Types.Exact<{ [key: string]: never }>

export type IngredientsQuery = {
  __typename?: 'Query'
  ingredients: Array<string>
}

export type UnitsQueryVariables = Types.Exact<{ [key: string]: never }>

export type UnitsQuery = { __typename?: 'Query'; units: Array<string> }
