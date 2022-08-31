import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useForm } from 'react-hook-form'
import RecipeForm from './form/RecipeForm'
import { RecipeQuery, RecipeQueryVariables } from './Recipe.types.gen'
import {
  UpdateRecipeMutation,
  UpdateRecipeMutationVariables,
} from './RecipeEdit.types.gen'
import FormData from './form/FormData.type'

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
  const { control, register, handleSubmit, reset } = useForm<FormData>()

  useEffect(() => {
    reset({
      name: data?.recipe.name,
      description: data?.recipe.description,
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
    return <p>Loading...</p>
  }
  if (error || !data?.recipe) {
    return <p>Error :(</p>
  }

  return (
    <>
      <Link to={`/${id}`}>Cancel</Link>
      <h2>Edit recipe</h2>
      <RecipeForm
        control={control}
        register={register}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  )
}

export default RecipeEdit
