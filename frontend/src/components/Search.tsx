import { Card, CardContent, Typography, Grid, TextField } from '@mui/material'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import React, { useState } from 'react'
import Loading from './utils/Loading'
import { SearchQuery, SearchQueryVariables } from './Search.types.gen'
import { useDebounceCallback } from 'usehooks-ts'
import { useSearchParams } from 'react-router-dom'
import RecipeListCard from './RecipeListCard'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryFromParams = searchParams.get('query') ?? ''
  const [query, setQuery] = useState(queryFromParams)

  const debouncedOnQueryChange = useDebounceCallback((query: string) => {
    setSearchParams({ query }, { replace: true })
    setQuery(query)
  }, 300)

  const { data, loading } = useQuery<SearchQuery, SearchQueryVariables>(
    gql`
      query Search($query: String!) {
        search(query: $query) {
          id
          name
          description
          categories
          ingredientGroups {
            id
            name
            ingredients {
              id
              name
              amount
              unit
            }
          }
        }
      }
    `,
    {
      variables: {
        query,
      },
      skip: query.length < 3,
    }
  )

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Typography variant="h4">Search recipes</Typography>

            <TextField
              size="small"
              margin="normal"
              label="Search criteria"
              fullWidth
              defaultValue={queryFromParams}
              onChange={(event) => debouncedOnQueryChange(event.target.value)}
            />
          </CardContent>
        </Card>
      </Grid>

      {loading ? (
        <Grid size={{ xs: 12 }}>
          <Loading />
        </Grid>
      ) : null}

      {data?.search.map((r, index) => (
        <RecipeListCard recipe={r} showCheckbox={false} key={index} />
      ))}
    </Grid>
  )
}

export default Search
