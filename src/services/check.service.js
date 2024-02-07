import checkModel from "../models/check.model.js"

class CheckService {
  constructor() { }

  createCheck = async (check) => {
    const result = await checkModel.create(check)
    return result
  }

  createChecks = async (checks) => {
    const result = await checkModel.insertMany(checks)
    return result
  }
}

export default CheckService