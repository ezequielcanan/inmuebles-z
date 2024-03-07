import transferModel from "../models/transfer.model.js";
import whitePaymentModel from "../models/whitePayment.model.js";
import fs from "fs"
import __dirname from "../utils.js"


class TransferService {
  constructor() { }

  createTransfer = async (transfer) => {
    const result = await transferModel.create(transfer)
    return result
  };

  createTransfers = async (transfers) => {
    const result = await transferModel.insertMany(transfers)
    return result
  }

  getFiles = (thumbnail) => {
    const files = []
    fs.readdirSync(__dirname + thumbnail).forEach(file => files.push(file))
    return files
  }

  deleteTransfer = async (payment, transfer, sid) => {
    const result = await transferModel.deleteOne({ _id: transfer?._id })
    const updateSubpaymentResult = await whitePaymentModel.findOneAndUpdate({ _id: sid }, { $pull: { "transfers": transfer?._id } }, { new: true })
    fs.rmSync(`${__dirname}/public/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}/transfers/${transfer?._id}`, { recursive: true, force: true })
    return updateSubpaymentResult
  }

  deleteTransferFromBill = async (tid) => {
    const result = await transferModel.deleteOne({ _id: tid })

    return result
  }

  updateTransfers = async (transfers) => {
    const transfersResult = []
    await Promise.all(transfers.map(async (transfer) => {
      const result = await transferModel.findOneAndUpdate({ _id: transfer?._id }, { $set: transfer }, { new: true })
      transfersResult.push(result)
    }))
    return transfersResult
  }

  getTransfersByAccount = async (aid) => transferModel.find({ account: aid }).sort({ emissionDate: 1 })
}

export default TransferService;
