import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Recipes from './components/Recipes'
import Recipe from './components/Recipe'
import RecipeAdd from './components/RecipeAdd'
import RecipeEdit from './components/RecipeEdit'

function App() {
  return (
    <>
      <h1>Cookbook</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Recipes />} />
          <Route path="new" element={<RecipeAdd />} />
          <Route path=":id" element={<Recipe />} />
          <Route path=":id/edit" element={<RecipeEdit />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
