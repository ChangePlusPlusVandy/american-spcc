import app from './app'
import { clerkMiddleware } from '@clerk/express'

app.use(clerkMiddleware())

export default app
