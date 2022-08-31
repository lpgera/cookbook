type FormData = {
  name: string
  description: string
  instructions: string
  ingredientGroups: {
    id?: number
    name: string
    ingredients: {
      id?: number
      name: string
      amount: string
      unit: string
    }[]
  }[]
}

export default FormData
