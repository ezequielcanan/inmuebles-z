import BlackPaymentService from "../services/blackPayment.service.js"
import PaymentService from "../services/payment.service.js"

const blackPaymentService = new BlackPaymentService()
const paymentService = new PaymentService()

export const createBlackPayment = async (req, res) => {
  try {
    const result = await blackPaymentService.createBlackPayment(req?.body, req?.params?.pid)
    const updateResult = await paymentService.insertSubPayment(req?.params?.pid, "black.payments", result?._id)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getBlackPayment = async (req, res) => {
  try {
    const result = await blackPaymentService.getBlackPayment(req?.params?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateBlackPayment = async (req,res) => {
  try {
    const result = await blackPaymentService.updateBlackPayment(req?.params?.sid, req?.body)
    res.sendSuccess(result)
  }
  catch(e) {
    console.error(e)
    res.sendServerError(e)
  }
} 

export const deleteBlackPayment = async (req,res) => {
  try {
    const {pid, sid} = req?.params
    const result = await blackPaymentService.deleteBlackPayment(pid, sid)
    const paymentRes = await paymentService.pullPayment(pid, sid, "black")
    res.sendSuccess(result)
  }
  catch(e) {
    console.error(e)
    res.sendServerError(e)
  }
}