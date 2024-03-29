import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/roboto'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'

const theme = createTheme({
  palette: {
    primary: {
      main: '#363636',
    },
    secondary: {
      main: '#3f51b5',
    },
    background: {
      default: '#f0f0f0',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h3: 'h1',
          h4: 'h2',
          h5: 'h3',
          h6: 'h4',
        },
      },
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
