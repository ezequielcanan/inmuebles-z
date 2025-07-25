import UserService from "../services/user.service.js"

const userService = new UserService()
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers()
    res.sendSuccess(users)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req?.params?.uid, req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getUserById = async (req, res) => {
  try {
    const { user } = req?.user
    const result = await userService.getUserById(user?._id)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const toggleUserNotificationsPermission = async (req, res) => {
  try {
    const { uid, tid } = req?.params
    const result = await userService.toggleUserNotificationsPermission(uid, tid, req?.query?.role)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const changeUserNotificationsRole = async (req, res) => {
  try {
    const { uid, tid } = req?.params
    const result = await userService.changeNotificationsRole(uid, tid, req?.query?.role)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}