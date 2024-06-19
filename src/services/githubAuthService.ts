import { Strategy as GithubStrategy } from 'passport-github2'
import { handleOauthCallback } from '../middleware/authMiddleware'

class GithubAuthService extends GithubStrategy {
  constructor() {
    super(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: '/auth/github/callback',
        scope: ['user:email']
      },
      handleOauthCallback
    )
  }
}


export default GithubAuthService