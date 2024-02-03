import checkModel from "../models/check.model.js"

class CheckService {
  constructor() {}

  createCheck = async (check) => {
    const result = await checkModel.create(check)
    return result
  }
}

export default CheckService