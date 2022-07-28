import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { RecipeQuery, RecipeQueryVariables } from './Recipe.types.gen'

const Recipe = () => {
  const { id } = useParams()
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
        id: parseInt(id ?? '0'),
      },
    }
  )

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !data?.recipe) {
    return <p>Error :(</p>
  }

  return (
    <>
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
      <p>
        {data.recipe.instructions?.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
            <br />
          </React.Fragment>
        ))}
      </p>
    </>
  )
}

export default Recipe
