import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Recipes from './components/Recipes'
import Recipe from './components/Recipe'

function App() {
  return (
    <>
      <h1>Cookbook</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Recipes />} />
          <Route path="/recipe/:id" element={<Recipe />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
