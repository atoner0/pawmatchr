import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import ejsLayouts from 'express-ejs-layouts'
import authRoutes from './routes/auth.js'
import dogRoutes from './routes/dog.js'
import adopterRoutes from './routes/adopter.js'
import applicationRoutes from './routes/application.js'
import adminRoutes from './admin/routes/admin.js'
import adminDogRoutes from './admin/routes/dogs.js'
import { sessionMiddleware } from './config/session.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

//View engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/admin/views'))
app.use(ejsLayouts)
app.set('layout', 'layout')

//Statis files
app.use(express.static(path.join(__dirname, '../public')))

//Parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Session
app.use(sessionMiddleware)

//API routes
app.use('/api/auth', authRoutes)
app.use('/api', dogRoutes, adopterRoutes, applicationRoutes )

//Web app routes
app.use('/admin', adminRoutes, adminDogRoutes)


app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app