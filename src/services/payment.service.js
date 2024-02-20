import paymentModel from "../models/payment.model.js"
import BudgetService from "./budget.service.js"
import WhitePaymentService from "./whitePayment.service.js"
import BlackPaymentService from "./blackPayment.service.js"
import billModel from "../models/bill.model.js"
import __dirname from "../utils.js"
import fs from "fs"

const whitePaymentService = new WhitePaymentService()
const blackPaymentService = new BlackPaymentService()
const budgetService = new BudgetService()

class PaymentService {
  constructor() { }

  createPayment = async (payment) => {
    const result = await paymentModel.create(payment)
    const adjustment = payment?.indexCac / payment?.budget?.baseIndex - 1
    payment?.budget?.lastPayment && await paymentModel.updateOne({ _id: payment?.budget?.lastPayment }, { $set: { "white.mcd": adjustment * payment?.budget?.lastPayment?.white?.amount, "black.mcd": adjustment * payment?.budget?.lastPayment?.black?.amount } })
    return result
  }

  getBudgetPayments = async (bid) => {
    const payments = await paymentModel.find({ budget: bid })
    return payments
  }

  getFiles = (project, budget, payment) => {
    const files = []
    fs.readdirSync(__dirname + "/public/projects/" + project + "/budgets/" + budget + "/payments/" + payment).forEach(file => files.push(file))
    return files
  }

  insertSubPayment = async (pid, type, subId) => {
    const update = {}
    update[type] = subId
    const result = await paymentModel.findOneAndUpdate({ _id: pid }, { $push: { ...update } }, { new: true })
    return result
  }

  insertBill = async (pid, bill) => {
    const result = await paymentModel.findOneAndUpdate({ _id: pid }, { $push: { "white.bills": bill } })
    return result
  }

  pullBill = async (pid, bid) => {
    const result = await paymentModel.updateOne({ _id: pid }, { $pull: { "white.bills": { "bill": bid } } })
    return result
  }

  pullPayment = async (pid, sid, type = "white") => {
    const updateObj = {}
    updateObj[`${type}.payments`] = sid
    const result = await paymentModel.updateOne({ _id: pid }, { $pull: updateObj })
    return result
  }

  updatePayment = async (id, payment) => {
    const result = await paymentModel.findOneAndUpdate({ _id: id }, { $set: { ...payment } }, { new: true })
    return result
  }

  addNote = async (id, note) => {
    const result = await paymentModel.findOneAndUpdate({ _id: id }, { $push: { notes: note } }, { new: true })
    return result
  }

  updateNote = async (id, nid, note) => {
    const result = await paymentModel.findOneAndUpdate({ _id: id, "notes._id": nid }, { $set: { "notes.$.note": note } })
    return result
  }

  deleteNote = async (id, nid) => {
    const result = await paymentModel.findOneAndUpdate({ _id: id }, { $pull: { "notes": { "_id": nid } } }, { new: true })
    return result
  }

  deletePayment = async (pid) => {
    const payment = await this.getPayment(pid)

    await Promise.all(payment?.white?.payments?.map(async (subpayment) => {
      const result = await whitePaymentService.deleteWhitePayment(pid, subpayment?._id)
      return {}
    }))

    await Promise.all(payment?.white?.bills?.map(async (bill) => {
      const result = await billModel.deleteOne({ _id: bill?.bill?._id })
      return result
    }))

    await Promise.all(payment?.black?.payments?.map(async (subpayment) => {
      const result = await blackPaymentService.deleteBlackPayment(pid, subpayment?._id)
      return {}
    }))
    fs.rmSync(`${__dirname}/public/projects/${payment?.budget?.project?._id}/budgets/${payment?.budget?._id}/payments/${payment?._id}`, { recursive: true, force: true })

    const deleteResult = await paymentModel.deleteOne({ _id: pid })
    const payments = await paymentModel.find({ budget: payment?.budget?._id }).sort({ paymentNumber: "desc" })

    await budgetService.updateBudget(payment?.budget?._id, { lastPayment: payments[0]?._id, advanced: payment?.budget?.advanced - (payment?.percentageOfTotal * payment?.budget?.total / 100) })

    return payment
  }

  getPayment = async (id) => paymentModel.findOne({ _id: id })

  getPaymentByNumber = async (number) => paymentModel.findOne({ paymentNumber: number })

  getFiles = (project, budget, payment) => {
    const files = []
    fs.readdirSync(__dirname + "/public/projects/" + project + "/budgets/" + budget + "/payments/" + payment).forEach(file => files.push(file))
    return files
  }

  deleteFile = thumbnail => {
    fs.unlinkSync(`${__dirname}/public/${thumbnail}`)
    return true
  }
}

export default PaymentService