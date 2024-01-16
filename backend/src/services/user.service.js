import userModel from "../models/user.model.js"

class UserService {
  constructor() { }

  getUsers = async () => {
    const users = await userModel.find().lean().exec()
    const roles = {
      status: true,
      admin: users.filter(u => u.role == "admin"),
      secretary: users.filter(u => u.role == "secretary"),
      user: users.filter(u => u.role == "user"),
      unknow: users.filter(u => u.role == "unknow")
    }
    return roles
  }

  getUserById = async (id) => {
    const user = await userModel.findById(id).lean().exec()
    return user
  }

  updateUser = async (id, user) => {
    const result = await userModel.updateOne({ _id: id }, { $set: user })
    return result
  }
}

export default UserService