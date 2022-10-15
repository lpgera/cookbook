import React, { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import LockOpen from '@mui/icons-material/LockOpen'
import { gql, useMutation } from '@apollo/client'
import { LoginMutation, LoginMutationVariables } from './Login.types.gen'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [, setToken] = useAuth()
  const [error, setError] = useState(false)
  const [password, setPassword] = useState('')
  const [login] = useMutation<LoginMutation, LoginMutationVariables>(gql`
    mutation Login($password: String!) {
      login(password: $password)
    }
  `)

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            try {
              const loginResult = await login({
                variables: {
                  password,
                },
              })

              const token = loginResult?.data?.login ?? ''
              setToken(token)
            } catch (error) {
              setError(true)
              throw error
            }
          }}
        >
          <Grid container spacing={1}>
            <Grid item>
              <TextField
                size={'small'}
                type={'password'}
                label={'Password'}
                error={error}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </Grid>
            <Grid item style={{ display: 'flex', alignItems: 'stretch' }}>
              <Button
                variant={'contained'}
                aria-label={'login'}
                type={'submit'}
              >
                <LockOpen />
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default Login
