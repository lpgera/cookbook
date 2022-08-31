import React from 'react'
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form'
import FormData from './FormData.type'

const IngredientFieldArray = ({
  control,
  register,
  groupIndex,
}: {
  control: Control<FormData>
  register: UseFormRegister<FormData>
  groupIndex: number
}) => {
  const { fields, append, swap, remove } = useFieldArray({
    control,
    name: `ingredientGroups.${groupIndex}.ingredients`,
  })
  return (
    <>
      {fields.map((field, index) => (
        <React.Fragment key={field.id}>
          <p>
            <input
              list="ingredients"
              {...register(
                `ingredientGroups.${groupIndex}.ingredients.${index}.name`,
                { required: true }
              )}
              placeholder={'Name'}
            />
            &nbsp;
            <input
              {...register(
                `ingredientGroups.${groupIndex}.ingredients.${index}.amount`
              )}
              placeholder={'Amount'}
            />
            &nbsp;
            <input
              list="units"
              {...register(
                `ingredientGroups.${groupIndex}.ingredients.${index}.unit`
              )}
              placeholder={'Unit'}
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
        <button onClick={() => append({ name: '', amount: '', unit: '' })}>
          ➕ Add ingredient{' '}
        </button>
      </p>
    </>
  )
}

export default IngredientFieldArray
