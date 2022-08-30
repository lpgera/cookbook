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
          ingredients {
            id
            name
            amount
            order
          }
        }
      }
    `,
    {
      variables: {
        id,
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
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
      <ul>
        {data.recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name}, {ingredient.amount}
          </li>
        ))}
      </ul>
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
