import 'dotenv/config'
import express from 'express'
import pool from './config/db.js'
import authRoutes from './routes/auth.js'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Database connection error:', err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app