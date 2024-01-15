import userModel from "../models/user.model.js"

class UserService {
  constructor() { }

  getUserValidProjects = async (id) => {
    const result = await userModel.findOne({ _id: id }).lean().exec()
    const projects = result?.projects

    return projects
  }
}