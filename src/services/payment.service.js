import paymentModel from "../models/payment.model.js"

class PaymentService {
  constructor() { }

  createPayment = async (payment) => {
    const result = await paymentModel.create(payment)
    const adjustment = payment?.indexCac / payment?.budget?.baseIndex
    payment?.budget?.lastPayment && await paymentModel.updateOne({ _id: payment?.budget?.lastPayment }, { $set: { "white.mcd": adjustment * payment?.budget?.lastPayment?.white?.amount, "black.mcd": adjustment * payment?.budget?.lastPayment?.black?.amount } })
    return result
  }

  getBudgetPayments = async (bid) => {
    const payments = await paymentModel.find({ budget: bid })
    return payments
  }

  insertSubPayment = async (pid, type, subId) => {
    const update = {}
    update[type] = subId
    const result = await paymentModel.findOneAndUpdate({ _id: pid }, { $push: { ...update } }, { new: true })
    return result
  }

  updatePayment = async (id, payment) => {
    const result = await paymentModel.findOneAndUpdate({ _id: id }, { $set: { ...payment } }, { new: true })
    return result
  }

  getPayment = async (id) => paymentModel.findOne({ _id: id })
}

export default PaymentService