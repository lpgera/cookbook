import React from 'react'
import { Control, UseFormRegister } from 'react-hook-form'
import { gql, useQuery } from '@apollo/client'
import { Fab } from '@mui/material'
import { Save } from '@mui/icons-material'
import IngredientGroupFieldArray from './IngredientGroupFieldArray'
import FormData from './FormData.type'
import { IngredientsQuery, UnitsQuery } from './RecipeForm.types.gen'

const RecipeForm = ({
  control,
  register,
  onSubmit,
}: {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  onSubmit: () => Promise<any>
}) => {
  const { data: ingredientsData } = useQuery<IngredientsQuery>(gql`
    query Ingredients {
      ingredients
    }
  `)
  const { data: unitsData } = useQuery<UnitsQuery>(gql`
    query Units {
      units
    }
  `)

  return (
    <>
      <form onSubmit={onSubmit}>
        <p>
          <input
            {...register('name', { required: true })}
            placeholder={'Name'}
          />
        </p>
        <p>
          <textarea {...register('description')} placeholder={'Description'} />
        </p>
        <h3>Ingredients</h3>
        <datalist id="ingredients">
          {ingredientsData?.ingredients.map((i) => (
            <option value={i} key={i} />
          ))}
        </datalist>
        <datalist id="units">
          {unitsData?.units.map((u) => (
            <option value={u} key={u} />
          ))}
        </datalist>
        <IngredientGroupFieldArray control={control} register={register} />
        <h3>Instructions</h3>
        <p>
          <textarea
            style={{
              width: '100%',
              height: '300px',
              boxSizing: 'border-box',
            }}
            {...register('instructions', { required: 'Required' })}
            placeholder={'Instructions'}
          />
        </p>
        <Fab
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          color="secondary"
          aria-label="save"
          onClick={onSubmit}
        >
          <Save />
        </Fab>
      </form>
    </>
  )
}

export default RecipeForm
