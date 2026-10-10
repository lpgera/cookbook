import React from 'react'
import { createHashRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { ApolloProvider } from '@apollo/client/react'
import Container from '@mui/material/Container'
import Recipes from './components/Recipes'
import Recipe from './components/Recipe'
import RecipeAdd from './components/RecipeAdd'
import RecipeEdit from './components/RecipeEdit'
import AppBar from './components/AppBar'
import Login from './components/Login'
import useApolloClient from './hooks/useApolloClient'
import useAuth from './hooks/useAuth'
import ShoppingList from './components/ShoppingList'
import Search from './components/Search'
import Error from './components/utils/Error'
import UpdatePrompt from './components/UpdatePrompt'

function Layout() {
  const [token] = useAuth()

  return (
    <>
      <AppBar />
      {token ? (
        <Container sx={{ pb: 12 }}>
          <Outlet />
        </Container>
      ) : (
        <Container maxWidth={'xs'}>
          <Login />
        </Container>
      )}
      <UpdatePrompt />
    </>
  )
}

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Recipes /> },
      { path: 'category/:category', element: <Recipes /> },
      { path: 'new', element: <RecipeAdd /> },
      { path: ':id', element: <Recipe /> },
      { path: ':id/edit', element: <RecipeEdit /> },
      { path: 'shopping-list', element: <ShoppingList /> },
      { path: 'search', element: <Search /> },
      { path: '*', element: <Error message="Page not found" /> },
    ],
  },
])

function App() {
  const client = useApolloClient()

  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} useTransitions={false} />
    </ApolloProvider>
  )
}

export default App
