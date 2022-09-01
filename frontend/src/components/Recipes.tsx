import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { RecipesQuery } from './Recipes.types.gen'
import { Link, useNavigate } from 'react-router-dom'

function Recipes() {
  const navigate = useNavigate()
  const { loading, error, data } = useQuery<RecipesQuery>(
    gql`
      query Recipes {
        recipes {
          id
          name
        }
      }
    `
  )

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error :(</p>
  }

  const recipes = data?.recipes ?? []

  return (
    <>
      <p>
        <button onClick={() => navigate('new')}>➕</button>
      </p>
      {recipes.map((r, index) => (
        <div key={index}>
          <Link to={`${r.id}`}>{r.name}</Link>
        </div>
      ))}
    </>
  )
}

export default Recipes
