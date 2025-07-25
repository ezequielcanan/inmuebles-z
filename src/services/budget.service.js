import budgetModel from "../models/budget.model.js"
import TransactionService from "./transaction.service.js"
import ApartmentService from "./apartment.service.js"
import ownerModel from "../models/owner.model.js"
import supplierModel from "../models/supplier.model.js"
import fs from "fs"
import __dirname from "../utils.js"


const transactionService = new TransactionService()
const apartmentService = new ApartmentService()

class BudgetService {
  constructor() { }

  createBudget = async (data) => {
    const supplier = await supplierModel.findById(data.supplier).lean().exec()
    const buyer = await ownerModel.findOne({ name: supplier?.name })

    const transactions = await Promise.all(data?.paidApartments.map(async (transaction) => {
      const apartment = await apartmentService.getApartmentById(transaction.apartment)
      const transactionObject = {
        apartment: transaction.apartment,
        seller: apartment?.owner?._id,
        buyer: buyer?._id,
        dolar: transaction?.dollar,
        total: transaction?.total,
        black: {
          quotas: 0
        },
        white: {
          quotas: 0
        }
      }
      const transactionResult = await transactionService.createTransaction(transactionObject)
      const apartmentResult = await apartmentService.updateApartment(transactionResult?.apartment, { owner: transactionResult?.buyer, forSale: false })
      return { apartment: transactionResult._id, discount: transaction?.subtractType, percentage: transaction?.percentage }
    }))

    data.advanced = data?.paidApartments?.reduce((acc, apartment) => apartment.subtractType == "total" ? acc + Number(apartment?.total * apartment?.dollar) : acc, data.bookingType != "quotas" ? Number(data?.booking) : 0) || (data.bookingType != "quotas" && Number(data?.booking)) || 0
    data.paidApartments = transactions

    const result = await budgetModel.create(data)
    return result
  }

  updateBudget = async (id, props) => {
    const result = await budgetModel.findOneAndUpdate({ _id: id }, { $set: { ...props } }, { new: true })
    return result
  }

  addNote = async (id, note) => {
    const result = await budgetModel.findOneAndUpdate({ _id: id }, { $push: { notes: note } }, { new: true })
    return result
  }

  updateNote = async (id, nid, note) => {
    const result = await budgetModel.findOneAndUpdate({ _id: id, "notes._id": nid }, { $set: { "notes.$.note": note } })
    return result
  }

  deleteNote = async (id, nid) => {
    const result = await budgetModel.findOneAndUpdate({ _id: id }, { $pull: { "notes": { "_id": nid } } }, { new: true })
    return result
  }

  getBudgetsBySupplier = async sid => budgetModel.find({ supplier: sid })
  getBudgetsByProject = async (pid, sid = "") => {
    const queryObj = { project: pid }
    sid?.length && (queryObj.supplier = sid)
    return budgetModel.find(queryObj)
  }

  getBudgets = async () => budgetModel.find()

  getBudget = async (bid) => budgetModel.findOne({ _id: bid })

  getFiles = (project, budget) => {
    const files = []
    fs.readdirSync(__dirname + "/public/projects/" + project + "/budgets/" + budget).forEach(file => files.push(file))
    return files
  }

  deleteFile = thumbnail => {
    fs.unlinkSync(`${__dirname}/public/${thumbnail}`)
    return true
  }

  deleteBudget = async bid => {
    const budget = await budgetModel?.findOneAndDelete({ _id: bid }, { new: true })
    fs.rmSync(`${__dirname}/public/projects/${budget?.project}/budgets/${budget?._id}`, { recursive: true, force: true })
    await Promise.all(budget?.paidApartments?.map(async (apartment) => {
      const transaction = await transactionService.getTransactionById(apartment?.apartment)
      await transactionService.deleteTransaction(apartment?.apartment)
      await apartmentService.updateApartment(transaction?.apartment?._id, { owner: transaction?.seller?._id, forSale: false })
    }))
    return budget
  }
}

export default BudgetService