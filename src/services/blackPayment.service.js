import blackPaymentModel from "../models/blackPayment.model.js"

export default class BlackPaymentService {
  constructor() { }

  createBlackPayment = async (payment, pid) => {
    const result = await blackPaymentModel.create(payment)

    return result
  }

  getBlackPayment = async (sid) => blackPaymentModel.findOne({ _id: sid })

  updateBlackPayment = async (sid, data) => {
    const result = await blackPaymentModel.updateOne({ _id: sid }, { $set: data })
    return result
  }

  deleteBlackPayment = async (pid, sid) => {
    const result = await blackPaymentModel.findOneAndDelete({_id: sid})
    
    return result
  }
}
