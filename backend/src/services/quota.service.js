import quotaModel from "../models/quota.model.js"
import transactionModel from "../models/transaction.model.js"

class QuotaService {
  constructor() { }

  createQuota = async (data) => {
    const result = await quotaModel.create(data)
    const update = { $set: {} }
    console.log(result)
    update["$set"][result.type + ".lastQuota"] = result._id
    result.indexCac ? (update["$set"][result.type + ".updatedQuota"] = result.total) : (update["$set"][result.type + ".updatedQuota"] = result.total + (result.total * result.cac / 100))
    const updateLastQuota = await transactionModel.updateOne({ _id: result.transaction }, update)
    return result
  }

  createQuotas = async (white, black) => {
    const result = await quotaModel.insertMany([white, black])
    return { white: result[0], black: result[1] }
  }

  getQuotaById = async (qid) => {
    const result = await quotaModel.findOne({ _id: qid })
    return result
  }

  getTransactionQuotas = async (tid) => {
    const result = await quotaModel.find({ transaction: tid })
    return result
  }

}

export default QuotaService