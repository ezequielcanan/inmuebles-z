import billModel from "../models/bill.model.js";
import PaymentService from "./payment.service.js";
import CheckService from "./check.service.js";
import TransferService from "./transfer.service.js"
import fs from "fs"
import __dirname from "../utils.js";

const transferService = new TransferService()
const checkService = new CheckService()
const paymentService = new PaymentService();
class BillService {
  constructor() { }

  createBill = async (bill, payment) => {
    const result = await billModel.create(bill);
    const paymentResult = await paymentService.getPayment(payment);

    const updatePayment = await paymentService.insertBill(payment, { bill: result?._id, concept: bill.concept });
    return result;
  }

  createBillWithoutPayment = async (bill) => billModel.create(bill)

  updateBill = async (bid, bill) => billModel.findOneAndUpdate({ _id: bid }, { $set: bill }, { new: true })

  addBalanceNote = async (bid, note) => billModel.findOneAndUpdate({ _id: bid }, { $push: { "notes": note } }, { new: true })

  updateBalanceNote = async (bid, nid, note) => {
    const updateObj = {}
    Object.entries(note).forEach((entry) => {
      updateObj[`notes.$.${entry[0]}`] = entry[1]
    })
    return billModel.findOneAndUpdate({ _id: bid, "notes._id": nid }, { $set: updateObj }, { new: true })
  }

  deleteBalanceNote = async (bid, nid) => {
    const result = await billModel.findOneAndUpdate({ _id: bid }, { $pull: { "notes": { _id: nid } } }, { new: true })
    return result
  }

  deleteBill = async (bid, pid) => {
    const result = await billModel.findOneAndDelete({ _id: bid })
    const pullBillFromPayment = await paymentService.pullBill(pid, bid)

    await Promise.all(result?.checks?.map(async (check) => {
      await checkService.deleteCheckFromBill(check?._id)
    }))

    await Promise.all(result?.transfers?.map(async (transfer) => {
      await transferService.deleteTransferFromBill(transfer?._id)
    }))

    return result
  }

  getFiles = (thumbnail) => {
    const files = []
    fs.readdirSync(__dirname + thumbnail).forEach(file => files.push(file))
    return files
  }

  updateBill = async (bid, data) => {
    const result = await billModel.updateOne({ _id: bid }, { $set: data })
    return result
  }

  getBillById = async (bid) => billModel.findOne({ _id: bid })

  getBillsByProjectAndSupplier = async (pid, sid) => billModel.find({ project: pid, receiver: sid })

  getBillsByRetentionAccount = async (aid) => billModel.find({ "retention.account": aid })
}

export default BillService;
