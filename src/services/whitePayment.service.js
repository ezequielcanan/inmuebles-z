import whitePaymentModel from "../models/whitePayment.model.js"
import checkModel from "../models/check.model.js"
import transferModel from "../models/transfer.model.js"

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

  getWhitePaymentsByRetentionAccount = async aid => whitePaymentModel.find({ "retention.account": aid })

  deleteWhitePayment = async (pid, sid) => {
    const result = await whitePaymentModel.findOneAndDelete({ _id: sid })
    await Promise.all(result?.checks?.map(async check => {
      await checkModel.deleteOne({ _id: check?._id })
    }))
    await Promise.all(result?.transfers?.map(async transfer => {
      await transferModel.deleteOne({ _id: transfer?._id })
    }))
    return result
  }
}