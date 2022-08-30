import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { gql, useMutation, useQuery } from '@apollo/client'
import { RecipeQuery, RecipeQueryVariables } from './Recipe.types.gen'
import { useFieldArray, useForm } from 'react-hook-form'
import {
  UpdateRecipeMutation,
  UpdateRecipeMutationVariables,
} from './RecipeEdit.types.gen'

type FormData = {
  name: string
  description: string
  instructions: string
  ingredients: {
    id: number
    name: string
    amount: string
  }[]
}

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
          ingredients {
            id
            name
            amount
            order
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
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'ingredients',
  })
  useEffect(() => {
    reset({
      name: data?.recipe.name,
      description: data?.recipe.description,
      instructions: data?.recipe.instructions,
      ingredients: data?.recipe.ingredients.map(({ id, name, amount }) => ({
        id,
        name,
        amount,
      })),
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
              <input {...register(`ingredients.${index}.id`)} type={'hidden'} />
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
          <button onClick={() => append({ id: 0, name: '', amount: '' })}>
            ➕
          </button>
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

export default RecipeEdit
