import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client'
import ReactMarkdown from 'react-markdown'
import { RecipeQuery, RecipeQueryVariables } from './Recipe.types.gen'

const Recipe = () => {
  const { id: rawId } = useParams()
  const id = parseInt(rawId ?? '0')
  const navigate = useNavigate()
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
  const [deleteRecipe] = useMutation(gql`
    mutation DeleteRecipe($id: Int!) {
      deleteRecipe(id: $id) {
        id
      }
    }
  `)

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !data?.recipe) {
    return <p>Error :(</p>
  }

  return (
    <>
      <Link to={'/'}>Recipes</Link>
      <h2>{data.recipe.name}</h2>
      <p>{data.recipe.description}</p>
      <h3>Ingredients</h3>
      {data.recipe.ingredientGroups.map((group) => (
        <React.Fragment key={group.id}>
          {group.name ? <h4>{group.name}</h4> : null}
          <ul>
            {group.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name}, {ingredient.amount} {ingredient.unit}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
      <h3>Instructions</h3>
      <ReactMarkdown children={data.recipe.instructions} />
      <p>
        <button onClick={() => navigate('edit')}>✏️</button>
        &nbsp;
        <button
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
          ❌
        </button>
      </p>
    </>
  )
}

export default Recipe
