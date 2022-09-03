import React from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import Container from '@mui/material/Container'
import Recipes from './components/Recipes'
import Recipe from './components/Recipe'
import RecipeAdd from './components/RecipeAdd'
import RecipeEdit from './components/RecipeEdit'
import AppBar from './components/AppBar'

function App() {
  return (
    <>
      <Router>
        <AppBar />
        <Container>
          <Routes>
            <Route path="/" element={<Recipes />} />
            <Route path="new" element={<RecipeAdd />} />
            <Route path=":id" element={<Recipe />} />
            <Route path=":id/edit" element={<RecipeEdit />} />
          </Routes>
        </Container>
      </Router>
    </>
  )
}

export default App
