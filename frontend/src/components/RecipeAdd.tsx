import React from 'react'
import { useForm } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography } from '@mui/material'
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
    <Card>
      <CardContent>
        <Typography variant="h4">Add recipe</Typography>
        <RecipeForm
          control={control}
          register={register}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CardContent>
    </Card>
  )
}

export default RecipeAdd
