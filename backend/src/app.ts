import 'dotenv/config'
import express from 'express'
import authRoutes from './routes/auth.js'
import dogRoutes from './routes/dog.js'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api', dogRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app