import app from './app.js'
import pool from './config/db.js'

const PORT = process.env.PORT || 3000

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Database connection error:', err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})