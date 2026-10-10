import React, { useCallback } from 'react'
import { useParams, Link as RouterLink, useSearchParams } from 'react-router'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Box, Fab, Grid, Typography } from '@mui/material'
import { Add, Search, ShoppingCart } from '@mui/icons-material'
import { RecipesQuery, RecipesQueryVariables } from './Recipes.types.gen'
import Loading from './utils/Loading'
import Error from './utils/Error'
import Categories from './Categories'
import RecipeListCard from './RecipeListCard'
import LetterRail, { letterAnchorId, useScrollbarGap } from './LetterRail'

const collator = new Intl.Collator(undefined, { sensitivity: 'base' })

const letterOf = (name: string) => {
  const letter = name
    .trim()
    .charAt(0)
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toUpperCase()
  return /\p{L}/u.test(letter) ? letter : '#'
}

function Recipes() {
  const { category } = useParams()
  const scrollbarGap = useScrollbarGap()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedRecipes =
    searchParams.get('recipes')?.split(',').filter(Boolean).map(Number) ?? []
  const setSelectedRecipes = useCallback(
    (recipes: number[]) => {
      if (!recipes.length) {
        setSearchParams({})
      } else {
        setSearchParams(
          {
            recipes: recipes.join(','),
          },
          {
            replace: true,
          }
        )
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

  const recipes = [...(data?.recipes ?? [])].sort((a, b) =>
    collator.compare(a.name, b.name)
  )
  const groups = new Map<string, typeof recipes>()
  for (const r of recipes) {
    const letter = letterOf(r.name)
    groups.set(letter, [...(groups.get(letter) ?? []), r])
  }

  return (
    <>
      <Box sx={{ pr: { xs: `${12 + scrollbarGap}px`, xl: 0 } }}>
        <Categories />
        {recipes.length === 0 ? (
          <Typography color="text.secondary">
            {category
              ? `No recipes in the "${category}" category`
              : 'No recipes yet'}
          </Typography>
        ) : null}
        <Grid container spacing={4}>
          {[...groups].map(([letter, groupRecipes]) => (
            <React.Fragment key={letter}>
              <Grid size={12} sx={{ mb: -3 }}>
                <Typography
                  id={letterAnchorId(letter)}
                  variant="overline"
                  component="h2"
                  color="text.secondary"
                  sx={{ scrollMarginTop: 80 }}
                >
                  {letter}
                </Typography>
              </Grid>
              {groupRecipes.map((r) => (
                <RecipeListCard
                  recipe={r}
                  isChecked={selectedRecipes.includes(r.id)}
                  onCheckedChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRecipes([...selectedRecipes, r.id])
                    } else {
                      setSelectedRecipes(
                        selectedRecipes.filter((id) => id !== r.id)
                      )
                    }
                  }}
                  key={r.id}
                />
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
      <LetterRail letters={[...groups.keys()]} />
      {selectedRecipes.length > 0 ? (
        <Fab
          style={{
            position: 'fixed',
            bottom: 168,
            right: 40 + scrollbarGap,
          }}
          color="secondary"
          component={RouterLink}
          to={{
            pathname: '/shopping-list',
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
          right: 40 + scrollbarGap,
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
          right: 40 + scrollbarGap,
        }}
        color="secondary"
        href={'/search'}
        aria-label="search"
      >
        <Search />
      </Fab>
    </>
  )
}

export default Recipes
