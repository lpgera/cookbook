import React from 'react'
import {
  Control,
  FormState,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form'
import { Button, Grid, IconButton, TextField } from '@mui/material'
import { Add, ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material'
import ControlledAutocompleteField from './ControlledAutocompleteField'
import FormData from './FormData.type'

const IngredientFieldArray = ({
  control,
  register,
  formState,
  ingredients,
  units,
  groupIndex,
}: {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  formState: FormState<FormData>
  ingredients: string[]
  units: string[]
  groupIndex: number
}) => {
  const { fields, append, swap, remove } = useFieldArray({
    control,
    name: `ingredientGroups.${groupIndex}.ingredients`,
  })
  return (
    <>
      {fields.map((field, index) => (
        <Grid
          container
          spacing={1}
          marginTop={1}
          marginBottom={2}
          key={field.id}
        >
          <Grid item>
            <ControlledAutocompleteField
              name={`ingredientGroups.${groupIndex}.ingredients.${index}.name`}
              label="Ingredient name"
              rules={{ required: true }}
              error={
                !!formState.errors.ingredientGroups?.[groupIndex]
                  ?.ingredients?.[index]?.name
              }
              options={ingredients}
              style={{ width: 195 }}
              control={control}
            />
          </Grid>
          <Grid item>
            <TextField
              size="small"
              {...register(
                `ingredientGroups.${groupIndex}.ingredients.${index}.amount`
              )}
              label={'Amount'}
              style={{ width: 100 }}
            />
          </Grid>
          <Grid item>
            <ControlledAutocompleteField
              name={`ingredientGroups.${groupIndex}.ingredients.${index}.unit`}
              label="Unit"
              options={units}
              style={{ width: 100 }}
              control={control}
            />
          </Grid>
          <Grid item>
            <Grid container>
              <Grid item>
                <IconButton
                  aria-label="swap up"
                  color="secondary"
                  onClick={() => swap(index, index - 1)}
                  disabled={index <= 0}
                >
                  <ArrowUpward />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="swap down"
                  color="secondary"
                  onClick={() => swap(index, index + 1)}
                  disabled={index >= fields.length - 1}
                >
                  <ArrowDownward />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => remove(index)}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ))}
      <p>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => append({ name: '', amount: '', unit: '' })}
          startIcon={<Add />}
        >
          Add ingredient
        </Button>
      </p>
    </>
  )
}

export default IngredientFieldArray
