import React, { useState } from 'react'
import { Autocomplete, Chip, TextField } from '@mui/material'
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form'

const ControlledAutocompleteTagsField = <T extends FieldValues>({
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
  const [inputValue, setInputValue] = useState('')

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onBlur, onChange, ref, value } }) => (
        <Autocomplete
          fullWidth
          multiple
          options={options}
          style={{
            display: 'inline-block',
            ...style,
          }}
          freeSolo
          value={value}
          inputValue={inputValue}
          onInputChange={(_, v) => setInputValue(v)}
          onBlur={() => {
            const typedValue = inputValue.trim()
            if (typedValue && !value.includes(typedValue)) {
              onChange([...value, typedValue])
            }
            setInputValue('')
            onBlur()
          }}
          onChange={(_, v) => onChange(v)}
          renderValue={(value: readonly string[], getItemProps) =>
            value.map((option: string, index: number) => (
              <Chip size="small" label={option} {...getItemProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={ref}
              error={error}
              size="small"
              label={label}
            />
          )}
        />
      )}
    />
  )
}

export default ControlledAutocompleteTagsField
