import { Chip, Link } from '@mui/material'
import React from 'react'
import { useSearchParams } from 'react-router'

const CategoryChip = ({
  category,
  href,
  isSelected = false,
}: {
  category: string
  href?: string
  isSelected?: boolean
}) => {
  const [searchParams] = useSearchParams()
  const recipes = searchParams.get('recipes')
  const search = recipes ? `?${new URLSearchParams({ recipes })}` : ''
  const path = href ?? `/category/${encodeURIComponent(category)}`

  return (
    <Chip
      label={category}
      color={isSelected ? 'secondary' : 'primary'}
      aria-current={isSelected ? 'page' : undefined}
      size="small"
      component={Link}
      clickable
      href={`${path}${search}`}
    />
  )
}

export default CategoryChip
