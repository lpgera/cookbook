import React from 'react'
import { Card, CircularProgress } from '@mui/material'

const Loading = () => {
  return (
    <Card
      style={{
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Card>
  )
}

export default Loading
