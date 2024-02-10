import checkModel from "../models/check.model.js"
import fs from "fs"
import __dirname from "../utils.js"

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

  getFiles = (thumbnail) => {
    const files = []
    fs.readdirSync(__dirname + thumbnail).forEach(file => files.push(file))
    return files
  }
  
}

export default CheckService