import React from 'react'
import { Control, FormState, UseFormRegister } from 'react-hook-form'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Fab, TextField, Typography } from '@mui/material'
import { Save } from '@mui/icons-material'
import IngredientGroupFieldArray from './IngredientGroupFieldArray'
import FormData from './FormData.type'
import { GlobalsQuery } from './RecipeForm.types.gen'
import ControlledAutocompleteTagsField from './ControlledAutocompleteTagsField'

const RecipeForm = ({
  control,
  register,
  formState,
  onSubmit,
}: {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  formState: FormState<FormData>
  onSubmit: () => Promise<any>
}) => {
  const { data } = useQuery<GlobalsQuery>(gql`
    query Globals {
      ingredients
      units
      categories
    }
  `)

  return (
    <form onSubmit={onSubmit}>
      <div>
        <TextField
          size="small"
          margin="normal"
          {...register('name', { required: true })}
          label="Name"
          error={!!formState.errors.name}
        />
      </div>
      <div>
        <TextField
          size="small"
          margin="normal"
          {...register('description')}
          label="Short description"
          fullWidth
        />
      </div>
      <div>
        <ControlledAutocompleteTagsField
          name={'categories'}
          label={'Categories'}
          options={data?.categories ?? []}
          control={control}
        />
      </div>

      <Typography variant="h5">Ingredients</Typography>
      <IngredientGroupFieldArray
        control={control}
        register={register}
        formState={formState}
        ingredients={data?.ingredients ?? []}
        units={data?.units ?? []}
      />

      <Typography variant="h5">Instructions</Typography>
      <div>
        <TextField
          size="small"
          margin="normal"
          {...register('instructions', { required: 'Required' })}
          label={'Instructions'}
          error={!!formState.errors.instructions}
          minRows={3}
          multiline
          fullWidth
        />
      </div>
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
  )
}

export default RecipeForm
