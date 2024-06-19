// express.d.ts
import { IUser } from '../src/models/userModel'

declare global {
  namespace Express {
    interface User extends IUser { }
  }
}

declare module 'express-session' {
  export interface SessionData {
    passport: { user: string }
  }
}