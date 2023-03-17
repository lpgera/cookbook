import jwt from 'jsonwebtoken'
import express from 'express'

const context = async ({ req }: { req: express.Request }) => {
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

export type Context = Awaited<ReturnType<typeof context>>

export default context
