import React from 'react'
import {
  Control,
  FormState,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form'
import { Button, Divider, TextField } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import IngredientFieldArray from './IngredientFieldArray'
import FormData from './FormData.type'

const IngredientGroupFieldArray = ({
  control,
  register,
  formState,
  ingredients,
  units,
}: {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  formState: FormState<FormData>
  ingredients: string[]
  units: string[]
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredientGroups',
  })

  return (
    <>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <div>
            <TextField
              size="small"
              margin="normal"
              {...register(`ingredientGroups.${index}.name`)}
              label="Group name (optional)"
            />
          </div>
          <IngredientFieldArray
            control={control}
            register={register}
            formState={formState}
            ingredients={ingredients}
            units={units}
            groupIndex={index}
          />
          <p>
            <Button
              variant="contained"
              color="error"
              onClick={() => remove(index)}
              disabled={index === 0}
              startIcon={<Delete />}
            >
              Remove group
            </Button>
          </p>

          <Divider
            style={{
              marginTop: 16,
            }}
          />
        </React.Fragment>
      ))}

      <p>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            append({
              name: '',
              ingredients: [
                {
                  name: '',
                  amount: '',
                  unit: '',
                },
              ],
            })
          }
          startIcon={<Add />}
        >
          Add group
        </Button>
      </p>
    </>
  )
}

export default IngredientGroupFieldArray
