import { paymentExcel } from "../excel/payments.js"
import PaymentService from "../services/payment.service.js"

const paymentService = new PaymentService()

export const createPayment = async (req, res) => {
  try {
    const result = await paymentService.createPayment(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getBudgetPayments = async (req, res) => {
  try {
    const result = await paymentService.getBudgetPayments(req?.params?.bid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getPayment = async (req, res) => {
  try {
    const result = await paymentService.getPayment(req?.params?.pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getExcelPayment = async (req, res) => {
  try {
    const payment = await paymentService.getPayment(req?.params?.pid)
    const lastPayment = await paymentService.getPaymentByNumber(payment?.paymentNumber - 1)


    const wb = paymentExcel(payment, lastPayment)
    wb.write(`Pago ${payment?.paymentNumber} - ${payment?.budget?.supplier?.name || ""}.xlsx`, res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const addNote = async (req, res) => {
  try {
    const result = await paymentService.addNote(req?.params?.pid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateNote = async (req, res) => {
  try {
    const result = await paymentService.updateNote(req?.params?.pid, req?.params?.nid, req?.body?.note)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteNote = async (req, res) => {
  try {
    const result = await paymentService.deleteNote(req?.params?.pid, req?.params?.nid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deletePayment = async (req, res) => {
  try {
    const result = await paymentService.deletePayment(req?.params?.pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteFile = (req, res) => {
  try {
    const result = paymentService.deleteFile(req?.body?.thumbnail)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getPaymentFiles = (req, res) => {
  try {
    const { projectId, bid, pid } = req?.params
    const result = paymentService.getFiles(projectId, bid, pid)
    res.sendSuccess(result)
  }
  catch (e) {
    if (e.code == "ENOENT") return res.sendNotFoundError()
    console.error(e)
    res.sendServerError(e)
  }
}

export const getProjectSupplierPayments = async (req, res) => {
  try {
    const { pid, sid } = req?.params
    const result = await paymentService.getProjectSupplierPayments(pid, sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}