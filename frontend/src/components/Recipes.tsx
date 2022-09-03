import React from 'react'
import { useNavigate } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Fab,
  Grid,
  Typography,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { RecipesQuery } from './Recipes.types.gen'
import Loading from './utils/Loading'
import Error from './utils/Error'

function Recipes() {
  const navigate = useNavigate()
  const { loading, error, data } = useQuery<RecipesQuery>(
    gql`
      query Recipes {
        recipes {
          id
          name
          description
        }
      }
    `
  )

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error message={error.message} />
  }

  const recipes = data?.recipes ?? []

  return (
    <>
      <Grid container spacing={4}>
        {recipes.map((r, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              style={{
                cursor: 'pointer',
              }}
              onClick={() => navigate(`${r.id}`)}
            >
              <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h5"
                  style={{ overflow: 'ellipsis' }}
                  noWrap
                >
                  {r.name}
                </Typography>
                <Typography
                  style={{ overflow: 'ellipsis', height: 24 }}
                  noWrap
                  variant="body2"
                >
                  {r.description}
                </Typography>
                <Box>
                  <Chip label="category" color="primary" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        color="secondary"
        onClick={() => navigate('new')}
        aria-label="add"
      >
        <Add />
      </Fab>
    </>
  )
}

export default Recipes
