import app from './app'
import { clerkMiddleware } from '@clerk/express'

const PORT = process.env.PORT || 8000

// Clerk applied globally (friend-style)
app.use(clerkMiddleware())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
