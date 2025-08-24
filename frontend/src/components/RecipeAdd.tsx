import React from 'react'
import { useForm } from 'react-hook-form'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography } from '@mui/material'
import RecipeForm from './form/RecipeForm'
import {
  AddRecipeMutation,
  AddRecipeMutationVariables,
} from './RecipeAdd.types.gen'
import FormData from './form/FormData.type'

const RecipeAdd = () => {
  const { control, register, formState, handleSubmit } = useForm<FormData>({
    defaultValues: {
      categories: [],
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
    <Card>
      <CardContent>
        <Typography variant="h4">Add recipe</Typography>
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

export default RecipeAdd
