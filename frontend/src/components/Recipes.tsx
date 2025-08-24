import React, { useCallback } from 'react'
import {
  useParams,
  Link as RouterLink,
  useSearchParams,
} from 'react-router-dom'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Fab, Grid } from '@mui/material'
import { Add, Search, ShoppingCart } from '@mui/icons-material'
import { RecipesQuery, RecipesQueryVariables } from './Recipes.types.gen'
import Loading from './utils/Loading'
import Error from './utils/Error'
import Categories from './Categories'
import RecipeListCard from './RecipeListCard'

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
        }, {
          replace: true,
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
          <RecipeListCard
            recipe={r}
            isChecked={selectedRecipes.includes(r.id)}
            onCheckedChange={(e) => {
              if (e.target.checked) {
                setSelectedRecipes([...selectedRecipes, r.id])
              } else {
                setSelectedRecipes(selectedRecipes.filter((id) => id !== r.id))
              }
            }}
            key={index}
          />
        ))}
      </Grid>
      {selectedRecipes.length > 0 ? (
        <Fab
          style={{
            position: 'fixed',
            bottom: 168,
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
          bottom: 96,
          right: 24,
        }}
        color="secondary"
        href={'/new'}
        aria-label="add"
      >
        <Add />
      </Fab>
      <Fab
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        color="secondary"
        href={'/search'}
        aria-label="searhc"
      >
        <Search />
      </Fab>
    </>
  )
}

export default Recipes
