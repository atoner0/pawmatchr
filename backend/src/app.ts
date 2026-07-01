import 'dotenv/config'
import express from 'express'
import path from 'path'
import ejsLayouts from 'express-ejs-layouts'
import authRoutes from './routes/auth.js'
import dogRoutes from './routes/dog.js'
import adopterRoutes from './routes/adopter.js'
import applicationRoutes from './routes/application.js'
import adminRoutes from './admin/routes/admin.js'
import { sessionMiddleware } from './config/session.js'

const projectRoot = process.cwd()

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(projectRoot, 'src/admin/views'))
app.use(ejsLayouts)
app.set('layout', 'layout')

app.use(express.static(path.join(projectRoot, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(sessionMiddleware)

app.use('/api/auth', authRoutes)
app.use('/api', dogRoutes, adopterRoutes, applicationRoutes )

app.use('/admin', adminRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app