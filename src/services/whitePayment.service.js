import whitePaymentModel from "../models/whitePayment.model.js";
import PaymentService from "./payment.service.js"

const paymentService = new PaymentService()
export default class WhitePaymentService {
  constructor() { }

  createWhitePayment = async (payment, pid) => {
    const result = await whitePaymentModel.create(payment)
    const updateResult = await paymentService.insertSubPayment(pid, "white.payments", result?._id)

    return result
  }
}