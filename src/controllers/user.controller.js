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