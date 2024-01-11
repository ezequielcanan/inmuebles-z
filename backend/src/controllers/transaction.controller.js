import TransactionService from "../services/transaction.service.js"

const transactionService = new TransactionService()
export const createTransaction = async (req, res) => {
  try {
    const result = await transactionService.createTransaction(req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getApartmentTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getApartmentTransactions(req?.params?.aid)
    res.sendSuccess(transactions)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}