import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar as MuiAppBar,
  Box,
  Toolbar,
  Typography,
  Slide,
  useScrollTrigger,
  useTheme,
} from '@mui/material'

export default function AppBar() {
  const trigger = useScrollTrigger()
  const theme = useTheme()

  return (
    <>
      <Box style={{ flexGrow: 1 }}>
        <Slide appear={false} direction="down" in={!trigger}>
          <MuiAppBar>
            <Toolbar>
              <Typography variant="h6" component="div">
                <RouterLink
                  to={'/'}
                  style={{
                    color: theme.palette.primary.contrastText,
                    textDecoration: 'none',
                  }}
                >
                  Cookbook
                </RouterLink>
              </Typography>
            </Toolbar>
          </MuiAppBar>
        </Slide>
      </Box>
      <Toolbar style={{ marginBottom: 24 }} />
    </>
  )
}
