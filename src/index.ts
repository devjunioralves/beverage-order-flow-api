import 'reflect-metadata'
import { connectDatabase } from '@infra/database'
import app from '@presentation/App'

const PORT = process.env.PORT || 3000

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`)
  })
})