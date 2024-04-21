import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Fab,
  Grid,
  Typography,
  Checkbox,
} from '@mui/material'
import { Add, ShoppingCart } from '@mui/icons-material'
import { RecipesQuery, RecipesQueryVariables } from './Recipes.types.gen'
import Loading from './utils/Loading'
import Error from './utils/Error'
import Categories from './Categories'

function Recipes() {
  const navigate = useNavigate()
  const { category } = useParams()
  const [selectedRecipes, setSelectedRecipes] = React.useState<Set<number>>(
    new Set()
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
            <Card
              style={{
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/${r.id}`)}
            >
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
                    {r.name}
                  </Typography>
                  <Checkbox
                    size="small"
                    checked={selectedRecipes.has(r.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecipes((prevState) =>
                          new Set(prevState).add(r.id)
                        )
                      } else {
                        setSelectedRecipes((prevState) => {
                          const newState = new Set(prevState)
                          newState.delete(r.id)
                          return newState
                        })
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
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
                        <Chip
                          label={c}
                          color="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/category/${c}`)
                          }}
                        />{' '}
                      </React.Fragment>
                    ))}
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedRecipes.size > 0 ? (
        <Fab
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
          }}
          color="secondary"
          onClick={() =>
            navigate({
              pathname: 'shopping-list',
              search: `?recipes=${Array.from(selectedRecipes).join(',')}`,
            })
          }
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
        onClick={() => navigate('new')}
        aria-label="add"
      >
        <Add />
      </Fab>
    </>
  )
}

export default Recipes
