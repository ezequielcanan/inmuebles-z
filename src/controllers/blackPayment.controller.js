import BlackPaymentService from "../services/blackPayment.service.js"

const blackPaymentService = new BlackPaymentService()

export const createBlackPayment = async (req, res) => {
  try {
    const result = await blackPaymentService.createBlackPayment(req?.body, req?.params?.pid)
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