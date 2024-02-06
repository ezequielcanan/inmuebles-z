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
      return { apartment: transactionResult._id, discount: transaction?.subtractType }
    }))

    data.advanced = data?.paidApartments?.reduce((acc, apartment) => apartment.subtractType == "total" ? acc + Number(apartment?.total * apartment?.dollar) : acc, Number(data?.booking)) || Number(data?.booking) || 0
    data.paidApartments = transactions

    const result = await budgetModel.create(data)
    return result
  }

  updateBudget = async (id, props) => {
    const result = await budgetModel.findOneAndUpdate({ _id: id }, { $set: { ...props } }, { new: true })
    return result
  }

  getBudgets = async () => budgetModel.find()

  getBudget = async (bid) => budgetModel.findOne({ _id: bid })

  getFiles = (project, budget) => {
    const files = []
    fs.readdirSync(__dirname + "/public/projects/" + project + "/budgets/" + budget).forEach(file => files.push(file))
    return files
  }
}

export default BudgetService