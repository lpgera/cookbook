import React from 'react'
import { Card } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const Error = ({ message }: { message?: string }) => {
  return (
    <Card
      style={{
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <ErrorIcon fontSize="large" />
      <br />
      {message}
    </Card>
  )
}

export default Error
