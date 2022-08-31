import React from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import RecipeForm from './form/RecipeForm'
import {
  AddRecipeMutation,
  AddRecipeMutationVariables,
} from './RecipeAdd.types.gen'
import FormData from './form/FormData.type'

const RecipeAdd = () => {
  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      ingredientGroups: [
        {
          name: '',
          ingredients: [
            {
              name: '',
              amount: '',
              unit: '',
            },
          ],
        },
      ],
    },
  })
  const [addRecipe] = useMutation<
    AddRecipeMutation,
    AddRecipeMutationVariables
  >(gql`
    mutation AddRecipe($recipe: RecipeInput!) {
      addRecipe(recipe: $recipe) {
        id
      }
    }
  `)
  const navigate = useNavigate()

  const onSubmit = async (recipe: FormData) => {
    await addRecipe({
      variables: {
        recipe,
      },
    })
    navigate('/', { replace: true })
  }

  return (
    <>
      <Link to={'/'}>Recipes</Link>
      <h2>New recipe</h2>
      <RecipeForm
        control={control}
        register={register}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  )
}

export default RecipeAdd
