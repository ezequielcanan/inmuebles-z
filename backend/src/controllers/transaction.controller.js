import TransactionService from "../services/transaction.service.js"
import QuotaService from "../services/quota.service.js"
import { createTransactionExcel } from "../excel/index.js"

const quotaService = new QuotaService()
const transactionService = new TransactionService()
export const createTransaction = async (req, res) => {
  try {
    const { transaction, white, black } = req.body
    const result = await transactionService.createTransaction(transaction)
    const { _id: tid } = result
    white.transaction = tid
    black.transaction = tid
    const { white: whiteRes, black: blackRes } = await quotaService.createQuotas(white, black)
    const finalResult = await transactionService.updateTransactionTypes({ updatedQuota: blackRes.total, lastQuota: blackRes._id }, { updatedQuota: whiteRes.total, lastQuota: whiteRes._id }, tid)
    res.sendSuccess(finalResult)
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

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params?.tid)
    res.sendSuccess(transaction)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const createTransactionXlsx = async (req, res) => {
  try {
    const white = await transactionService.getTransactionWhiteQuotas(req?.params?.tid)
    const black = await transactionService.getTransactionBlackQuotas(req?.params?.tid)

    const transaction = await transactionService.getTransactionById(req?.params?.tid)
    const wb = createTransactionExcel(transaction, {white,black})
    wb.write("excel.xlsx", res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}