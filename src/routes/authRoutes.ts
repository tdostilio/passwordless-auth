import express from 'express'
import passport from 'passport'
import MailerService from '../services/mailerService'
import dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

// Google OAuth
router.get('/auth/google', passport.authenticate('google', <any>{ accessType: 'offline', prompt: 'consent' }))

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/login')
})

// GitHub OAuth
router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/login')
})

// Magic Link
router.get('/auth/link', async (req, res, next) => {
  try {
    // send email with magic link
    const email = req.body.email || process.env.EMAIL_ADDRESS
    await MailerService.sendMagicLink(email)
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message })
    }
  }
  res.send('<h1>Please check your email to login</h1>')
})

router.get('/auth/link/callback', passport.authenticate('magic-link', { failureRedirect: '/login' }), async (req, res, next) => {
  res.redirect('/login')
})

export default router