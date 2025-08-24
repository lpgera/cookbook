import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, Typography } from '@mui/material'
import RecipeForm from './form/RecipeForm'
import { RecipeQuery, RecipeQueryVariables } from './RecipeEdit.types.gen'
import {
  UpdateRecipeMutation,
  UpdateRecipeMutationVariables,
} from './RecipeEdit.types.gen'
import FormData from './form/FormData.type'
import Loading from './utils/Loading'
import Error from './utils/Error'

const RecipeEdit = () => {
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
              order
            }
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
  const { control, register, formState, handleSubmit, reset } =
    useForm<FormData>()

  useEffect(() => {
    reset({
      name: data?.recipe.name,
      description: data?.recipe.description,
      categories: data?.recipe.categories ?? [],
      instructions: data?.recipe.instructions,
      ingredientGroups: data?.recipe.ingredientGroups.map(
        ({ id, name, ingredients }) => ({
          id,
          name,
          ingredients: ingredients.map(({ id, name, amount, unit }) => ({
            id,
            name,
            amount,
            unit,
          })),
        })
      ),
    })
  }, [data, reset])
  const navigate = useNavigate()
  const [updateRecipe] = useMutation<
    UpdateRecipeMutation,
    UpdateRecipeMutationVariables
  >(gql`
    mutation UpdateRecipe($id: Int!, $recipe: RecipeInput!) {
      updateRecipe(id: $id, recipe: $recipe) {
        id
      }
    }
  `)

  const onSubmit = async (recipe: FormData) => {
    await updateRecipe({
      variables: {
        id,
        recipe,
      },
    })
    navigate(`/${id}`, { replace: true })
  }

  if (loading) {
    return <Loading />
  }
  if (error || !data?.recipe) {
    return <Error message={error?.message} />
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4">Edit recipe</Typography>
        <RecipeForm
          control={control}
          register={register}
          formState={formState}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CardContent>
    </Card>
  )
}

export default RecipeEdit
