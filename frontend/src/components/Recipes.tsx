import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { RecipesQuery } from './Recipes.types.gen'

function Recipes() {
  const { loading, error, data } = useQuery<RecipesQuery>(gql`
    query Recipes {
      recipes {
        id
        name
      }
    }
  `)

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error :(</p>
  }

  const recipes = data?.recipes ?? []

  return (
    <>
      {recipes.map((r) => (
        <div>
          <a href={`/recipe/${r.id}`}>{r.name}</a>
        </div>
      ))}
    </>
  )
}

export default Recipes
