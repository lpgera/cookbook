import jwt from 'jsonwebtoken'
import { ExpressContext } from 'apollo-server-express'

const context = ({ req }: ExpressContext) => {
  const xToken = req.headers['x-token']
  const token = Array.isArray(xToken) ? xToken[0] : xToken

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
