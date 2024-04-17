import { gql, useQuery } from '@apollo/client'
import { CategoriesQuery } from './Categories.types.gen'
import { Chip, Grid, Link } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Categories = () => {
  const navigate = useNavigate()

  const { data: { categories = [] } = {} } = useQuery<CategoriesQuery>(gql`
    query Categories {
      categories
    }
  `)

  return (
    <Grid container spacing={1} marginBottom={2}>
      <Grid item key={'all'}>
        <Chip
          label={'All recipes'}
          color="primary"
          size="small"
          onClick={() => navigate(`/`)}
        />
      </Grid>
      {categories.map((category) => (
        <Grid item key={category}>
          <Chip
            label={category}
            color="primary"
            size="small"
            onClick={() => navigate(`/category/${category}`)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default Categories
