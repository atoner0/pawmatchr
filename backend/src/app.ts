import 'dotenv/config'
import express from 'express'
import authRoutes from './routes/auth.js'
import dogRoutes from './routes/dog.js'
import adopterRoutes from './routes/adopter.js'
import applicationRoutes from './routes/application.js'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api', dogRoutes, adopterRoutes, applicationRoutes )

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app