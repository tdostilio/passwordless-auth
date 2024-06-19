import { Request, Response } from 'express'
import UserService from '../services/userService'

export class UserController {
  private userService: typeof UserService

  constructor(userService: typeof UserService) {
    this.userService = userService
  }

  async createUser(req: Request, res: Response) {
    const { firstName, lastName, email } = req.body
    try {
      const user = await this.userService.createUser(req.body)
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ message: 'Unable to create user' })
    }
  }

  async getUser(req: Request, res: Response) {
    const user = req.user
    const { id } = req.params
    if (id !== user?.id) return res.status(403).json({ message: 'Unauthorized' })
    try {
      const user = await this.userService.getUser(id)
      res.json(user)
    } catch (err) {
      res.status(404).json({ message: 'User not found' })
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params
    const updates = req.body
    try {
      const user = await this.userService.updateUser(id, updates)
      res.json(user)
    } catch (err) {
      res.status(422).json({ message: 'Unable to update user' })
    }
  }

}