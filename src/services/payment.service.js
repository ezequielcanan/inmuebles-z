import paymentModel from "../models/payment.model.js"

class PaymentService {
  constructor() { }

  createPayment = async (payment) => {
    const result = await paymentModel.create(payment)
    return result
  }

  getBudgetPayments = async (bid) => {
    const payments = await paymentModel.find({ budget: bid })
    return payments
  }

  updatePayment = async (id, payment) => {
    const result = await paymentModel.findOneAndUpdate({ _id: id }, { $set: { ...payment } }, { new: true })
    return result
  }

  getPayment = async (id) => paymentModel.findOne({ _id: id })
}

export default PaymentService