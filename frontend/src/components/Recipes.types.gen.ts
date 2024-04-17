import * as Types from '../graphql.types.gen'

export type RecipesQueryVariables = Types.Exact<{
  category?: Types.InputMaybe<Types.Scalars['String']['input']>
}>

export type RecipesQuery = {
  __typename?: 'Query'
  recipes: Array<{
    __typename?: 'Recipe'
    id: number
    name: string
    description: string
    categories: Array<string>
  }>
}
