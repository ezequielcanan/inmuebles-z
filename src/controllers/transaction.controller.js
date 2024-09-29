import TransactionService from "../services/transaction.service.js"
import QuotaService from "../services/quota.service.js"
import moment from "moment"
import { createFutureQuotasExcel, createTransactionExcel } from "../excel/index.js"

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
    const finalResult = await transactionService.updateTransactionTypes({ updatedQuota: !blackRes.baseIndex ? blackRes.total + (blackRes.total * blackRes.cac / 100) : blackRes.total, lastQuota: blackRes._id }, {
      updatedQuota: !whiteRes.baseIndex ? whiteRes.total + (whiteRes.total * whiteRes.cac / 100) : whiteRes.total, lastQuota: whiteRes._id
    }, tid)
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

export const updateTransaction = async (req, res) => {
  try {
    const update = {}
    update[`${req?.params?.type}.baseIndex`] = req?.body?.baseIndex
    const transaction = await transactionService.updateTransaction(req?.params?.tid, update)
    res.sendSuccess(transaction)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const toggleTransaction = async (req, res) => {
  try {
    const oldTransaction = await transactionService.getTransactionById(req?.params?.tid)
    const update = {}
    update["finished"] = !oldTransaction?.finished
    const transaction = await transactionService.updateTransaction(req?.params?.tid, update)
    res.sendSuccess(transaction)
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
    const wb = createTransactionExcel(transaction, { white, black })
    wb.write(`Detalle ${transaction?.apartment?.project?.title || ""} UF ${transaction?.apartment?.unit || ""}.xlsx`, res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const createFutureQuotasXlsx = async (req, res) => {
  try {
    const transactions = await transactionService.getAllProjectTransactions(req.params?.pid)
    const cacHistory = await (await fetch("https://prestamos.ikiwi.net.ar/api/cacs")).json()
    const secondIndexCac = cacHistory[cacHistory.length - 3]?.general
    const lastIndexCac = cacHistory[cacHistory.length - 2]?.general
    const indexCac = cacHistory[cacHistory.length - 1]?.general
    const wb = createFutureQuotasExcel(transactions.filter(t => !t.finished), lastIndexCac, indexCac, secondIndexCac)
    wb.write(`Cuotas ${transactions[0]?.apartment?.project?.title || ""}.xlsx`, res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const deleteTransaction = async (req, res) => {
  try {
    const result = await transactionService.deleteTransaction(req?.params?.tid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const insertApartmentByPayment = async (req, res) => {
  try {
    const result = await transactionService.insertApartmentByPayment(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}