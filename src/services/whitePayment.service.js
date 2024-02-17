import whitePaymentModel from "../models/whitePayment.model.js"

export default class WhitePaymentService {
  constructor() { }

  createWhitePayment = async (payment, pid) => {
    const result = await whitePaymentModel.create(payment)
    return result
  }

  getWhitePayment = async (sid) => whitePaymentModel.findOne({ _id: sid })

  updateWhitePayment = async (sid, data) => {
    const result = await whitePaymentModel.updateOne({ _id: sid }, { $set: data })
    return result
  }

  deleteWhitePayment = async (pid, sid) => {
    const result = await whitePaymentModel.findOneAndDelete({_id: sid})
    return result
  }
}