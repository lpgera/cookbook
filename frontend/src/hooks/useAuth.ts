import { useLocalStorage } from 'usehooks-ts'

export default function useAuth() {
  const [token, setToken] = useLocalStorage('cookbook-token', '')

  return [token, setToken]
}
