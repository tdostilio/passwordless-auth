import User, { IUser } from '../models/userModel'
import { PassportStatic } from 'passport'
import GoogleAuthService from '../services/googleAuthService'
import MagicLinkService from '../services/magicLinkService'
import GithubAuthService from '../services/githubAuthService'
import { Profile, VerifyCallback } from 'passport-google-oauth20'
import UserService from '../services/userService'

const setupPassport = (passport: PassportStatic) => {

  // service middleware
  passport.use('google', new GoogleAuthService())
  passport.use('magic-link', new MagicLinkService())
  passport.use('github', new GithubAuthService())

  passport.serializeUser(function (user: IUser, done) {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}

// Req can be optionally passed in as the first argument, but I've chosen to omit it
const handleOauthCallback = async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  const { id, displayName, emails, name, photos } = profile
  const userData = {
    id,
    displayName,
    email: emails ? emails[0].value : undefined,
    firstName: name ? name.givenName : undefined,
    lastName: name ? name.familyName : undefined,
    picture: photos ? photos[0].value : undefined
  }
  const { email, firstName, lastName, picture } = userData
  let existingUser
  try {
    if (accessToken || refreshToken) {
      console.log(accessToken)
      console.log(refreshToken)
    }
    existingUser = await User.findOne({ email })
  } catch (err) {
    return done(err)
  }
  // save access token and refresh toke
  if (existingUser) {
    return done(undefined, existingUser)
  }
  // if not found, create user
  let user
  try {
    user = await UserService.createUser({ firstName, lastName, email, picture })
  } catch (error) {
    return done(error)
  }
  done(null, user)
}


const handleMagicLinkCallback = async (req: any, done: VerifyCallback) => {
  let email
  try {
    email = MagicLinkService.verifyToken(req.query?.token)
  } catch (err) {
    return done(err)
  }
  if (!email) {
    return done(new Error('Email is required'))
  }
  try {
    let user: IUser | null = await User.findOne({ email })
    if (!user) {
      user = await UserService.createUser({ email })
    }
    done(null, user)
  } catch (err) {
    return done(err)
  }
}


export {
  setupPassport,
  handleOauthCallback,
  handleMagicLinkCallback
}