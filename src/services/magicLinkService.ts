import { Strategy } from 'passport-custom'
import { handleMagicLinkCallback } from '../middleware/authMiddleware'
import jwt from 'jsonwebtoken'


class MagicLinkService extends Strategy {
  constructor() {
    // this is the magic link strategy after a user clicks the email link
    super(handleMagicLinkCallback)
  }

  static generateToken(email: string) {
    // take the email and encode it with a token
    if (!process.env.JWT_SECRET_KEY) throw new Error('Unable to generate token')
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
  }

  static verifyToken(token: string): string {
    if (!process.env.JWT_SECRET_KEY) throw new Error('Unable to verify token')
    try {
      // jwt token returns string if payload is string, object if payload is object
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      if (typeof decoded === 'object' && 'email' in decoded) {
        return decoded.email
      } else {
        throw new Error('Token payload is not an object or missing email')
      }
    } catch (err) {
      console.error(err)
      throw new Error('Invalid or expired token')
    }
  }
}

export default MagicLinkService