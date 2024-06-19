import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { handleOauthCallback } from '../middleware/authMiddleware'

class GoogleAuthService extends GoogleStrategy {
  constructor() {
    super(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: '/auth/google/callback',
        scope: ['email', 'profile']
      },
      handleOauthCallback
    )
  }
}


export default GoogleAuthService