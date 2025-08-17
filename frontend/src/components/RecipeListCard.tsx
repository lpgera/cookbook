import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import CategoryChip from './CategoryChip'

const RecipeListCard = ({
  recipe,
  showCheckbox = true,
  isChecked = false,
  onCheckedChange = () => {},
}: {
  recipe: {
    id: number
    name: string
    description: string
    categories: string[]
  }
  showCheckbox?: boolean
  isChecked?: boolean
  onCheckedChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <Card>
        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h5"
              style={{ overflow: 'ellipsis', flexGrow: 1 }}
              noWrap
            >
              <Link href={`/${recipe.id}`}>{recipe.name}</Link>
            </Typography>
            {showCheckbox ? (
              <Checkbox
                size="small"
                checked={isChecked}
                onChange={onCheckedChange}
              />
            ) : null}
          </div>
          <Typography
            style={{ overflow: 'ellipsis', height: 24 }}
            noWrap
            variant="body2"
          >
            {recipe.description}
          </Typography>
          {recipe.categories.length ? (
            <Box>
              {recipe.categories.map((c) => (
                <React.Fragment key={c}>
                  <CategoryChip category={c} />{' '}
                </React.Fragment>
              ))}
            </Box>
          ) : null}
        </CardContent>
      </Card>
    </Grid>
  )
}

export default RecipeListCard
