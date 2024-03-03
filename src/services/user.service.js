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

  toggleUserNotificationsPermission = async (uid, tid, role) => {
    const isActivatedNotifications = (await userModel.findOne({ _id: uid }).lean().exec())?.notifications?.some(n => n?.user == tid)
    const notificationObj = { role, user: tid }
    const result = !isActivatedNotifications ? await userModel.updateOne({ _id: uid }, { $push: { "notifications": notificationObj } }) : await userModel.updateOne({ _id: uid }, { $pull: { "notifications": { user: tid } } })
    return result
  }

  changeNotificationsRole = async (uid, tid, role) => {
    const result = await userModel?.updateOne({ _id: uid, notifications: { $elemMatch: { user: tid } } }, { $set: { "notifications.$.role": role } })
    return result
  }
}

export default UserService