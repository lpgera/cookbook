import React from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
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

function App() {
  const [token] = useAuth()
  const client = useApolloClient()

  return (
    <ApolloProvider client={client}>
      <Router>
        <AppBar />
        {token ? (
          <Container>
            <Routes>
              <Route path="/" element={<Recipes />} />
              <Route path="category/:category" element={<Recipes />} />
              <Route path="new" element={<RecipeAdd />} />
              <Route path=":id" element={<Recipe />} />
              <Route path=":id/edit" element={<RecipeEdit />} />
              <Route path="shopping-list" element={<ShoppingList />} />
              <Route path="search" element={<Search />} />
            </Routes>
          </Container>
        ) : (
          <Container maxWidth={'xs'}>
            <Login />
          </Container>
        )}
      </Router>
    </ApolloProvider>
  )
}

export default App
