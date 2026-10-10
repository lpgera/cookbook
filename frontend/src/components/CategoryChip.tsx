import { Chip, Link } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router'

const CategoryChip = ({
  category,
  href,
}: {
  category: string
  href?: string
}) => {
  const [searchParams] = useSearchParams()
  const recipes = searchParams.get('recipes')
  const search = recipes ? `?${new URLSearchParams({ recipes })}` : ''
  const path = href ?? `/category/${encodeURIComponent(category)}`

  return (
    <Chip
      label={category}
      color="primary"
      size="small"
      component={Link}
      clickable
      href={`${path}${search}`}
    />
  )
}

export default CategoryChip
