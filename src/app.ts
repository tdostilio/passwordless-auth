import express, { Application, Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import passport from 'passport'
import { setupPassport } from './middleware/authMiddleware'
import session from 'express-session'

// Load environment variables and configure passport
dotenv.config()
setupPassport(passport)

// Create express app
const app: Application = express()

// Add middleware
app.use(cors())
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // set to true if served over https
    maxAge: 24 * 60 * 60 * 1000 // 24 hours - not super sensitive
  }
}))

// Initialize passport with express
app.use(passport.initialize())
app.use(passport.session())

// Add routes
app.use(userRoutes)
app.use(authRoutes)

// Placeholder login route to check if user is logged in
app.get('/login', (req: Request, res: Response) => {
  if (req.user) {
    return res.send(`<h1>Logged in with user: ${JSON.stringify(req.user)}</h1>`)
  }
  res.send('<h1>Please log in</h1>')
})


// Database connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err))



export default app