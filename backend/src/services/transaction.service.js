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
}

export default TransactionService