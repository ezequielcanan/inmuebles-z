import quotaModel from "../models/quota.model.js"
import transactionModel from "../models/transaction.model.js"

class QuotaService {
  constructor() { }

  createQuota = async (data) => {
    const result = await quotaModel.create(data)
    const transaction = await transactionModel.findOne({ _id: result?.transaction })
    const update = { $set: {} }

    update["$set"][result.type + ".lastQuota"] = result._id
    
    result.paidUSD ? (update["$set"][result.type + ".updatedQuota"] = result.total) : (result?.indexCac ? (update["$set"][result.type + ".updatedQuota"] = result.total) : update["$set"][result.type + ".updatedQuota"] = result.total + (result.total * result.cac / 100) + (data.balance < 0 ? data.balance : 0))
    const updateLastQuota = await transactionModel.updateOne({ _id: result.transaction }, update)
    return result
  }

  createQuotas = async (white, black) => {
    const result = await quotaModel.insertMany([white, black])
    return { white: result[0], black: result[1] }
  }

  deleteQuotaAndUpdateTransaction = async (qid) => {
    const deleted = await quotaModel.findOneAndDelete({ _id: qid })
    const result = await quotaModel.findOne({ transaction: deleted.transaction, quota: deleted.quota - 1, type: deleted.type })
    const previousQuota = await quotaModel.findOne({ transaction: deleted.transaction, quota: deleted.quota - 2, type: deleted.type })
    const update = { $set: {}, $unset: {} }

    deleted.quota == 1 && (update["$unset"][deleted.type + ".baseIndex"] = 1)
    update[result?._id ? "$set" : "$unset"][deleted.type + ".lastQuota"] = result?._id || 1
    update[result?._id ? "$set" : "$unset"][deleted.type + ".updatedQuota"] = result?._id ? ((result?.paidUSD || result?.indexCac) ? result?.total : result?.total + (result?.total * result?.cac / 100) + (previousQuota?.balance < 0 ? previousQuota?.balance : 0)) : 1

    const updateTransaction = await transactionModel.findOneAndUpdate({ _id: deleted.transaction }, update, { new: true })
    return updateTransaction
  }

  getQuotaById = async (qid) => {
    const result = await quotaModel.findOne({ _id: qid })
    return result
  }

  getTransactionQuotas = async (tid) => {
    const result = await quotaModel.find({ transaction: tid }).lean().exec()
    return result
  }

}

export default QuotaService