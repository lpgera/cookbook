import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client'
import ReactMarkdown from 'react-markdown'
import {
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
} from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import { RecipeQuery, RecipeQueryVariables } from './Recipe.types.gen'
import Loading from './utils/Loading'
import Error from './utils/Error'

const ActionMenu = ({ id }: { id: number }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorEl)
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
      <IconButton
        id={'action-button'}
        aria-controls={isOpen ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'action-button',
        }}
      >
        <MenuItem
          onClick={() => {
            navigate('edit')
          }}
        >
          Edit recipe
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (
              window.confirm('Are you sure you want to delete this recipe?')
            ) {
              await deleteRecipe({
                variables: {
                  id,
                },
              })
              navigate('/')
            }
          }}
        >
          Delete recipe
        </MenuItem>
      </Menu>
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
          <ActionMenu id={id} />
        </Box>
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
                  {ingredient.name}, {ingredient.amount} {ingredient.unit}
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
  )
}

export default Recipe
