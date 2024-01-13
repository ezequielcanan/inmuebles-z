import transactionModel from "../models/transaction.model.js"

class TransactionService {
  constructor() { }

  createTransaction = async (data) => {
    const result = await transactionModel.create(data)
    return result
  }

  getApartmentTransactions = async (aid) => {
    const result = await transactionModel.find({ apartment: aid })
    return result
  }

  getTransactionById = async (tid) => {
    const result = await transactionModel.findOne({ _id: tid })
    return result
  }

  updateTransactionTypes = async (black, white, tid) => {
    const result = await transactionModel.updateOne({ _id: tid }, { $set: { "black.updatedQuota": black.updatedQuota, "black.lastQuota": black.lastQuota, "white.updatedQuota": white.updatedQuota, "white.lastQuota": white.lastQuota } })
    return result
  }
}

export default TransactionService