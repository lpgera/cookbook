import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'

const ControlledAutocompleteField = <T extends FieldValues>({
  name,
  label,
  options,
  control,
  error,
  rules,
  style = {},
}: {
  name: Path<T>
  label: string
  options: string[]
  control: Control<T>
  error?: boolean
  rules?: RegisterOptions<T>
  style?: React.CSSProperties
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Autocomplete
          options={options}
          style={{
            display: 'inline-block',
            ...style,
          }}
          freeSolo
          getOptionLabel={(option) => option}
          {...field}
          onChange={(e, v) => field.onChange(v)}
          renderInput={(params) => (
            <TextField
              {...params}
              error={error}
              onChange={(e) => field.onChange(e.target.value)}
              size="small"
              label={label}
            />
          )}
        />
      )}
    />
  )
}

export default ControlledAutocompleteField
