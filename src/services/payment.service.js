import paymentModel from "../models/payment.model.js"

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

  inserBill = async (pid, bill) => {
    const result = await paymentModel.findOneAndUpdate({ _id: pid }, { $push: { "white.bills": bill } })
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

  getPayment = async (id) => paymentModel.findOne({ _id: id })

  getPaymentByNumber = async (number) => paymentModel.findOne({ paymentNumber: number })
}

export default PaymentService