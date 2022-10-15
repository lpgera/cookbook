import { useLocalStorage } from 'usehooks-ts'

export default function useAuth(): [string, (token: string) => void] {
  const [token, setToken] = useLocalStorage('cookbook-token', '')

  return [token, setToken]
}
