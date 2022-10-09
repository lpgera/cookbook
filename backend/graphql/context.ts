import jwt from 'jsonwebtoken'
import { ExpressContext } from 'apollo-server-express'

const context = ({ req }: ExpressContext) => {
  const token = req.headers.authorization || ''

  try {
    if (process.env.JWT_SECRET && token) {
      jwt.verify(token, process.env.JWT_SECRET)
      return { isLoggedIn: true }
    }
  } catch (error) {
    console.error(error)
  }

  return { isLoggedIn: false }
}

export type Context = ReturnType<typeof context>

export default context
