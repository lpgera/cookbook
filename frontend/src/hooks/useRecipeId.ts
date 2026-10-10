import { useParams } from 'react-router'

// NaN when the route parameter is not a plain positive integer
export default function useRecipeId() {
  const { id = '' } = useParams()
  return /^\d+$/.test(id) ? Number(id) : NaN
}
