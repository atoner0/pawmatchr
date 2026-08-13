import 'dotenv/config'
import express from 'express'
import path from 'path'
import ejsLayouts from 'express-ejs-layouts'
import authRoutes from './routes/auth.js'
import dogRoutes from './routes/dog.js'
import adopterRoutes from './routes/adopter.js'
import adminRoutes from './admin/routes/admin.js'
import { sessionMiddleware } from './config/session.js'
import { ageLabel, capitaliseFirst, aloneToleranceLabel } from './admin/utils/displayLabels.js'

const projectRoot = process.cwd()

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(projectRoot, 'src/admin/views'))
app.use(ejsLayouts)
app.set('layout', 'layout')

app.locals.ageLabel = ageLabel
app.locals.capitaliseFirst = capitaliseFirst
app.locals.aloneToleranceLabel = aloneToleranceLabel

app.use(express.static(path.join(projectRoot, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(sessionMiddleware)

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});



//api
app.use('/api/adopter', authRoutes)
app.use('/api/adopter', adopterRoutes)
app.use('/api', dogRoutes )

//web app
app.use('/admin', adminRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app