import React from 'react'
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form'
import FormData from './FormData.type'
import IngredientFieldArray from './IngredientFieldArray'

const IngredientGroupFieldArray = ({
  control,
  register,
}: {
  control: Control<FormData>
  register: UseFormRegister<FormData>
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredientGroups',
  })

  return (
    <>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <p>
            <input
              {...register(`ingredientGroups.${index}.name`)}
              placeholder={'Group name (optional)'}
            />
          </p>
          <IngredientFieldArray
            control={control}
            register={register}
            groupIndex={index}
          />
          <p>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={index === 0}
            >
              ❌ Remove group
            </button>
          </p>
        </React.Fragment>
      ))}

      <p>
        <button
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
        >
          ➕ Add group
        </button>
      </p>
    </>
  )
}

export default IngredientGroupFieldArray
