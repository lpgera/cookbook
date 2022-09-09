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
      render={({ field: { onBlur, onChange, ref, value } }) => (
        <Autocomplete
          options={options}
          style={{
            display: 'inline-block',
            ...style,
          }}
          freeSolo
          getOptionLabel={(option) => option}
          value={value}
          onBlur={onBlur}
          onChange={(e, v) => onChange(v)}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={ref}
              error={error}
              onChange={(e) => onChange(e.target.value)}
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
