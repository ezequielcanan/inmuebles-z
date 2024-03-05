import PaymentService from "../services/payment.service.js"
import WhitePaymentService from "../services/whitePayment.service.js"
import CheckService from "../services/check.service.js"
import TransferService from "../services/transfer.service.js"

const whitePaymentService = new WhitePaymentService()
const paymentService = new PaymentService()
const checkService = new CheckService()
const transferService = new TransferService()

export const createWhitePayment = async (req, res) => {
  try {
    const result = await whitePaymentService.createWhitePayment(req?.body, req?.params?.pid)
    const updateResult = await paymentService.insertSubPayment(req?.params?.pid, "white.payments", result?._id)

    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getWhitePayment = async (req, res) => {
  try {
    const result = await whitePaymentService.getWhitePayment(req?.params?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateWhitePayment = async (req, res) => {
  try {
    const result = await whitePaymentService.updateWhitePayment(req?.params?.sid, req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteWhitePayment = async (req, res) => {
  try {
    const { sid, pid } = req?.params
    const result = await whitePaymentService.deleteWhitePayment(pid, sid)

    const payment = await paymentService.getPayment(pid)
    await Promise.all(result?.checks?.map(async (check) => {
      const result = await checkService.deleteCheck(payment, check, sid)
      return {}
    }))

    await Promise.all(result?.transfers?.map(async (transfer) => {
      const result = await transferService.deleteTransfer(payment, transfer, sid)
      return {}
    }))

    const paymentResult = await paymentService.pullPayment(pid, sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}