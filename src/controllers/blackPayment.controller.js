import BlackPaymentService from "../services/blackPayment.service.js"

const blackPaymentService = new BlackPaymentService()

export const createBlackPayment = async (req, res) => {
  try {
    const result = await blackPaymentService.createBlackPayment(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}