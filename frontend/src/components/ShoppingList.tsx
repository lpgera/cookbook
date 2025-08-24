import { Card, CardContent, Divider, Typography, Link } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import React, { Fragment } from 'react'
import {
  ShoppingListQuery,
  ShoppingListQueryVariables,
} from './ShoppingList.types.gen'
import Loading from './utils/Loading'

const ShoppingList = () => {
  const [searchParams] = useSearchParams()
  const recipes = searchParams.get('recipes') ?? ''
  const ids = recipes.split(',').map(Number)
  const { data } = useQuery<ShoppingListQuery, ShoppingListQueryVariables>(
    gql`
      query ShoppingList($ids: [Int!]!) {
        recipes(ids: $ids) {
          id
          name
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
        ids,
      },
    }
  )

  if (!data) {
    return <Loading />
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Shopping list</Typography>

        {data?.recipes.map((recipe, index) => (
          <Fragment key={index}>
            <Divider
              style={{
                marginTop: 16,
                marginBottom: 16,
              }}
            />
            <div>
              <Typography variant="h5">
                <Link href={`/${recipe.id}`}>{recipe.name}</Link>
              </Typography>
              {recipe.ingredientGroups.map((group, index) => (
                <div key={index}>
                  <Typography variant="h6">{group.name}</Typography>
                  <ul>
                    {group.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

export default ShoppingList
