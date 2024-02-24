import userModel from "../models/user.model.js"

class UserService {
  constructor() { }

  getUsers = async () => {
    const users = await userModel.find().lean().exec()
    const roles = {
      status: true,
      admin: users.filter(u => u.role == "admin"),
      executive: users.filter(u => u.role == "executive"),
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

  toggleUserNotificationsPermission = async (uid, tid) => {
    let result = await userModel.updateOne({ _id: uid }, { $addToSet: { notifications: tid } })
    result = !result?.modifiedCount ? await userModel.updateOne({ _id: uid }, { $pull: { notifications: tid } }) : result
    return result
  }
}

export default UserService