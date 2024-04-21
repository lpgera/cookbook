import { gql, useQuery } from '@apollo/client'
import { CategoriesQuery } from './Categories.types.gen'
import { Grid } from '@mui/material'
import React from 'react'
import CategoryChip from './CategoryChip'

const Categories = () => {
  const { data: { categories = [] } = {} } = useQuery<CategoriesQuery>(gql`
    query Categories {
      categories
    }
  `)

  return (
    <Grid container spacing={1} marginBottom={4}>
      <Grid item key={'all'}>
        <CategoryChip category={'All recipes'} href={'/'} />
      </Grid>
      {categories.map((category) => (
        <Grid item key={category}>
          <CategoryChip category={category} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Categories
