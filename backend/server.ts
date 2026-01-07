import app from "./app"

const PORT = process.env.PORT || 8000

// ✅ Only listen locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

// ✅ Always export for Vercel
export default app
