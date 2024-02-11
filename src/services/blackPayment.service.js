import blackPaymentModel from "../models/blackPayment.model.js";
import PaymentService from "./payment.service.js";

const paymentService = new PaymentService()
export default class BlackPaymentService {
  constructor() { }

  createBlackPayment = async (payment, pid) => {
    const result = await blackPaymentModel.create(payment)
    const updateResult = await paymentService.insertSubPayment(pid, "black.payments", result?._id)

    return result
  }

  getBlackPayment = async (sid) => blackPaymentModel.findOne({ _id: sid })
}
