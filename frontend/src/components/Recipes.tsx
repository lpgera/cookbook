import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { RecipesQuery } from './Recipes.types.gen'
import { Link } from 'react-router-dom'

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
      {recipes.map((r, index) => (
        <div key={index}>
          <Link to={`/recipe/${r.id}`}>{r.name}</Link>
        </div>
      ))}
    </>
  )
}

export default Recipes
