import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { gql, useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import {
  AddRecipeMutation,
  AddRecipeMutationVariables,
} from './RecipeAdd.types.gen'

type FormData = {
  name: string
  description: string
  instructions: string
  ingredients: {
    name: string
    amount: string
  }[]
}

const RecipeAdd = () => {
  const { control, register, handleSubmit } = useForm<FormData>()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'ingredients',
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          <input
            {...register('name', { required: true })}
            placeholder={'Name'}
          />
        </p>
        <p>
          <textarea
            {...register('description', { required: true })}
            placeholder={'Description'}
          />
        </p>
        <h3>Ingredients</h3>
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <p>
              <input
                {...register(`ingredients.${index}.name`, { required: true })}
                placeholder={'Name'}
              />
              &nbsp;
              <input
                {...register(`ingredients.${index}.amount`)}
                placeholder={'Amount'}
              />
              &nbsp;
              <button
                type="button"
                onClick={() => swap(index, index - 1)}
                disabled={index <= 0}
              >
                ⬆️
              </button>
              &nbsp;
              <button
                type="button"
                onClick={() => swap(index, index + 1)}
                disabled={index >= fields.length - 1}
              >
                ⬇️
              </button>
              &nbsp;
              <button type="button" onClick={() => remove(index)}>
                ❌
              </button>
            </p>
          </React.Fragment>
        ))}
        <p>
          <button onClick={() => append({ name: '', amount: '' })}>➕</button>
        </p>
        <h3>Instructions</h3>
        <p>
          <textarea
            {...register('instructions', { required: 'Required' })}
            placeholder={'Instructions'}
          />
        </p>
        <p>
          <button type="submit">💾</button>
        </p>
      </form>
    </>
  )
}

export default RecipeAdd
