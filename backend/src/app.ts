import 'dotenv/config'
import express from 'express'
import pool from './config/db.js'

const app = express()
app.use(express.json())

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