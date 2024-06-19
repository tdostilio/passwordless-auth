import express from 'express'
import { UserController } from '../controllers/userController'
import UserService from '../services/userService'
import passport from 'passport'

const router = express.Router()
const userController = new UserController(UserService)

// Simple example of a protected route
router.get('/users/:id', passport.authenticate('session'), (req, res) => userController.getUser(req, res))

export default router