import User, { IUser } from '../models/userModel'

class UserService {
  public async createUser(userDetails: Partial<IUser>) {
    try {
      const user = new User(userDetails)
      await user.save()
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  public async getUser(id: string) {
    let user
    try {
      user = await User.findOne({ _id: id })
      if (!user) {
        throw new Error('User not found')
      }
      return user
    } catch (error) {
      throw error
    }
  }

  public async updateUser(id: string, updates: Partial<IUser>) {
    try {
      const user = await User.findByIdAndUpdate(id, updates, { new: true })
      return user
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

}

export default new UserService()