import paymentModel from "../models/payment.model.js"

class PaymentService {
  constructor() {}

  createPayment = async (payment) => {
    const result = await paymentModel.create(payment)
    return result
  }

  updatePayment = async (id, payment) => {
    const result = await paymentModel.findOneAndUpdate({_id: id}, {$set: {...payment}}, {new: true})
    return result
  }
}

export default PaymentService