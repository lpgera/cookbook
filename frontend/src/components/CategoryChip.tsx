import { Chip, Link } from '@mui/material'
import React from 'react'

const CategoryChip = ({
  category,
  href,
}: {
  category: string
  href?: string
}) => {
  return (
    <Chip
      label={category}
      color="primary"
      size="small"
      component={Link}
      clickable
      href={href ?? `/category/${category}`}
    />
  )
}

export default CategoryChip
