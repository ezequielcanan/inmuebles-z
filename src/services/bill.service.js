import billModel from "../models/bill.model.js";
import PaymentService from "./payment.service.js";
import fs from "fs"
import __dirname from "../utils.js";

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
    const result = await billModel.findOneAndUpdate({_id: bid}, {$pull: {"notes": {_id: nid}}}, {new: true})
    return result
  }

  deleteBill = async (bid, pid) => {
    const result = await billModel.deleteOne({ _id: bid })
    const pullBillFromPayment = await paymentService.pullBill(pid, bid)

    return result
  }

  getFiles = (thumbnail) => {
    const files = []
    fs.readdirSync(__dirname + thumbnail).forEach(file => files.push(file))
    return files
  }

  getBillById = async (bid) => billModel.findOne({ _id: bid })
}

export default BillService;
