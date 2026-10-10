import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { CategoriesQuery } from './Categories.types.gen'
import { Grid } from '@mui/material'
import React from 'react'
import { useParams } from 'react-router'
import CategoryChip from './CategoryChip'

const Categories = () => {
  const { data: { categories = [] } = {} } = useQuery<CategoriesQuery>(gql`
    query Categories {
      categories
    }
  `)
  const { category: selectedCategory } = useParams()

  return (
    <Grid container spacing={1} style={{ marginBottom: '32px' }}>
      <Grid key={'all'}>
        <CategoryChip
          category={'All recipes'}
          href={'/'}
          isSelected={!selectedCategory}
        />
      </Grid>
      {categories.map((category) => (
        <Grid key={category}>
          <CategoryChip
            category={category}
            isSelected={
              category.toLowerCase() === selectedCategory?.toLowerCase()
            }
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default Categories
