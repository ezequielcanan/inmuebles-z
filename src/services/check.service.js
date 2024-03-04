import checkModel from "../models/check.model.js"
import whitePaymentModel from "../models/whitePayment.model.js"
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

  deleteCheck = async (payment, check, sid) => {
    const result = await checkModel.deleteOne({ _id: check?._id })
    const updateSubpaymentResult = await whitePaymentModel.findOneAndUpdate({ _id: sid }, { $pull: { "checks": check?._id } }, { new: true })
    fs.rmSync(`${__dirname}/public/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/checks/${check?._id}`, { recursive: true, force: true })
    return updateSubpaymentResult
  }

  updateChecks = async (checks) => {
    const checksResult = []
    await Promise.all(checks.map(async (check) => {
      const result = await checkModel.findOneAndUpdate({ _id: check?._id }, { $set: check }, { new: true })
      checksResult.push(result)
    }))
    return checksResult
  }

  getChecksByAccount = async (aid) => checkModel.find({ account: aid }).sort({ emissionDate: 1 })

}

export default CheckService