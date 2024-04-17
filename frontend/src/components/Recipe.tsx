import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client'
import ReactMarkdown from 'react-markdown'
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  Fab,
  Chip,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { RecipeQuery, RecipeQueryVariables } from './Recipe.types.gen'
import Loading from './utils/Loading'
import Error from './utils/Error'

const ActionMenu = ({ id }: { id: number }) => {
  const navigate = useNavigate()
  const [deleteRecipe] = useMutation(gql`
    mutation DeleteRecipe($id: Int!) {
      deleteRecipe(id: $id) {
        id
      }
    }
  `)

  return (
    <>
      <Fab
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        color="secondary"
        onClick={() => navigate('edit')}
        aria-label="edit"
      >
        <Edit />
      </Fab>
      <Fab
        style={{
          position: 'fixed',
          bottom: 96,
          right: 24,
        }}
        color="error"
        onClick={async () => {
          if (window.confirm('Are you sure you want to delete this recipe?')) {
            await deleteRecipe({
              variables: {
                id,
              },
            })
            navigate('/')
          }
        }}
        aria-label="delete"
      >
        <Delete />
      </Fab>
    </>
  )
}

const Recipe = () => {
  const { id: rawId } = useParams()
  const id = parseInt(rawId ?? '0')
  const { loading, error, data } = useQuery<RecipeQuery, RecipeQueryVariables>(
    gql`
      query Recipe($id: Int!) {
        recipe(id: $id) {
          id
          name
          description
          categories
          instructions
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
        id,
      },
    }
  )

  if (loading) {
    return <Loading />
  }
  if (error || !data?.recipe) {
    return <Error message={error?.message} />
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box
            style={{
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              gutterBottom
              variant="h4"
              style={{
                flexGrow: 1,
              }}
            >
              {data.recipe.name}
            </Typography>
          </Box>
          {data.recipe.categories.map((c) => (
            <React.Fragment key={c}>
              <Chip
                label={c}
                size="small"
                color="primary"
                style={{ marginBottom: 8 }}
              />{' '}
            </React.Fragment>
          ))}
          {data.recipe.description ? (
            <Typography variant="body1">{data.recipe.description}</Typography>
          ) : null}

          <Divider
            style={{
              marginTop: 16,
              marginBottom: 16,
            }}
          />

          <Typography variant="h5">Ingredients</Typography>
          {data.recipe.ingredientGroups.map((group) => (
            <React.Fragment key={group.id}>
              {group.name ? (
                <Typography variant="h6">{group.name}</Typography>
              ) : null}
              <ul>
                {group.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ))}

          <Divider
            style={{
              marginTop: 16,
              marginBottom: 16,
            }}
          />

          <Typography variant="h5">Instructions</Typography>
          <ReactMarkdown children={data.recipe.instructions} />
        </CardContent>
      </Card>
      <ActionMenu id={id} />
    </>
  )
}

export default Recipe
