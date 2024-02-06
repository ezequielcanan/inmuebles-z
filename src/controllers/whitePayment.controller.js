import WhitePaymentService from "../services/whitePayment.service.js"

const whitePaymentService = new WhitePaymentService()

export const createWhitePayment = async (req, res) => {
  try {
    const result = await whitePaymentService.createWhitePayment(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
} 