import React, { useCallback } from 'react'
import {
  useParams,
  Link as RouterLink,
  useSearchParams,
} from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Card,
  CardContent,
  Fab,
  Grid,
  Typography,
  Checkbox,
  Link,
} from '@mui/material'
import { Add, ShoppingCart } from '@mui/icons-material'
import { RecipesQuery, RecipesQueryVariables } from './Recipes.types.gen'
import Loading from './utils/Loading'
import Error from './utils/Error'
import Categories from './Categories'
import CategoryChip from './CategoryChip'

function Recipes() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedRecipes =
    searchParams.get('recipes')?.split(',').filter(Boolean).map(Number) ?? []
  const setSelectedRecipes = useCallback(
    (recipes: number[]) => {
      if (!recipes.length) {
        setSearchParams({})
      } else {
        setSearchParams({
          recipes: recipes.join(','),
        })
      }
    },
    [setSearchParams]
  )

  const { error, data } = useQuery<RecipesQuery, RecipesQueryVariables>(
    gql`
      query Recipes($category: String) {
        recipes(category: $category) {
          id
          name
          description
          categories
        }
      }
    `,
    {
      variables: {
        category,
      },
    }
  )

  if (error) {
    return <Error message={error.message} />
  }
  if (!data) {
    return <Loading />
  }

  const recipes = data?.recipes ?? []

  return (
    <>
      <Categories />
      <Grid container spacing={4}>
        {recipes.map((r, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h5"
                    style={{ overflow: 'ellipsis', flexGrow: 1 }}
                    noWrap
                  >
                    <Link href={`/${r.id}`}>{r.name}</Link>
                  </Typography>
                  <Checkbox
                    size="small"
                    checked={selectedRecipes.includes(r.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecipes([...selectedRecipes, r.id])
                      } else {
                        setSelectedRecipes(
                          selectedRecipes.filter((id) => id !== r.id)
                        )
                      }
                    }}
                  />
                </div>
                <Typography
                  style={{ overflow: 'ellipsis', height: 24 }}
                  noWrap
                  variant="body2"
                >
                  {r.description}
                </Typography>
                {r.categories.length ? (
                  <Box>
                    {r.categories.map((c) => (
                      <React.Fragment key={c}>
                        <CategoryChip category={c} />{' '}
                      </React.Fragment>
                    ))}
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedRecipes.length > 0 ? (
        <Fab
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
          }}
          color="secondary"
          component={RouterLink}
          to={{
            pathname: 'shopping-list',
            search: searchParams.toString(),
          }}
          aria-label="shopping list"
        >
          <ShoppingCart />
        </Fab>
      ) : null}
      <Fab
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        color="secondary"
        href={'/new'}
        aria-label="add"
      >
        <Add />
      </Fab>
    </>
  )
}

export default Recipes
