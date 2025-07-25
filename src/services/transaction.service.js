import transactionModel from "../models/transaction.model.js"
import quotaModel from "../models/quota.model.js"
import ApartmentService from "./apartment.service.js"
import mongoose from "mongoose"
import ownerModel from "../models/owner.model.js"
import budgetModel from "../models/budget.model.js"

const apartmentService = new ApartmentService()

class TransactionService {
  constructor() { }

  createTransaction = async (data) => {
    const result = await transactionModel.create(data)
    return result
  }

  insertApartmentByPayment = async data => {
    const buyer = await ownerModel.findOne({ name: data.supplier?.name })
    const apartment = await apartmentService.getApartmentById(data.apartment?._id)
    const transactionObject = {
      apartment: data.apartment?.apartment,
      seller: apartment?.owner?._id,
      buyer: buyer?._id,
      dolar: data?.apartment.dollar,
      total: data?.apartment?.total,
      black: {
        quotas: 0
      },
      white: {
        quotas: 0
      }
    }

    const transactionResult = await this.createTransaction(transactionObject)
    const apartmentResult = await apartmentService.updateApartment(transactionResult?.apartment, { owner: transactionResult?.buyer, forSale: false })
    const budgetResult = await budgetModel.findOneAndUpdate({ _id: data?.bid }, { $push: { "paidApartments": { apartment: transactionResult?._id, discount: data?.apartment?.subtractType } }, $inc: { "advanced": data?.apartment?.subtractType == "total" ? (data?.apartment?.total * data?.apartment?.dollar) || 0 : 0 } }, { new: true })
    return budgetResult
  }

  getApartmentTransactions = async (aid) => {
    const result = await transactionModel.find({ apartment: aid })
    return result
  }

  getTransactionById = async (tid) => {
    const result = await transactionModel.findOne({ _id: tid }).lean().exec()
    return result
  }

  updateTransaction = async (tid, update) => {
    const result = await transactionModel.updateOne({ _id: tid }, update)
    return result
  }

  updateTransactionTypes = async (black, white, tid) => {
    const result = await transactionModel.updateOne({ _id: tid }, { $set: { "black.updatedQuota": black.updatedQuota, "black.lastQuota": black.lastQuota, "white.updatedQuota": white.updatedQuota, "white.lastQuota": white.lastQuota } })
    return result
  }

  getTransactionWhiteQuotas = async (tid) => {
    const quotas = await quotaModel.find({ transaction: tid, type: "white" }).lean().exec()
    return quotas
  }

  getTransactionBlackQuotas = async (tid) => {
    const quotas = await quotaModel.find({ transaction: tid, type: "black" }).lean().exec()
    return quotas
  }

  deleteTransaction = async (tid) => transactionModel.deleteOne({ _id: tid })

  getProjectTransactions = async (pid) => {
    const transactions = await transactionModel.aggregate([
      {
        $lookup: {
          from: "apartments",
          localField: "apartment",
          foreignField: "_id",
          as: "apartment",
        }
      },
      { $unwind: '$apartment' },
      { $match: { "apartment.project": new mongoose.Types.ObjectId(pid) } },
      { $sort: { "date": -1 } }
    ])

    return transactions
  }

  getAllProjectTransactions = async (pid) => {
    const transactions = await transactionModel.aggregate([
      {
        $lookup: {
          from: "apartments",
          localField: "apartment",
          foreignField: "_id",
          as: "apartment",
        }
      },
      { $unwind: '$apartment' },
      { $match: { "apartment.project": new mongoose.Types.ObjectId(pid) } },
      {
        $lookup: {
          from: "projects",
          localField: "apartment.project",
          foreignField: "_id",
          as: "apartment.project",
        }
      },
      { $unwind: '$apartment.project' },
      {
        $lookup: {
          from: "floors",
          localField: "apartment.floor",
          foreignField: "_id",
          as: "apartment.floor",
        }
      },
      { $unwind: { path: '$apartment.floor', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "owners",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        }
      },
      { $unwind: { path: '$buyer', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "quotas",
          localField: "white.lastQuota",
          foreignField: "_id",
          as: "white.lastQuota",
        }
      },
      { $unwind: { path: '$white.lastQuota', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "quotas",
          localField: "black.lastQuota",
          foreignField: "_id",
          as: "black.lastQuota",
        }
      },
      { $addFields: { "black.lastQuota": "$black.lastQuota" } },
      { $unwind: { path: '$black.lastQuota', preserveNullAndEmptyArrays: true } },
      {
        $set: {
          "white": { $cond: { if: { $or: [{ $eq: ["$white.lastQuota.quota", "$white.quotas"] }, { $eq: ["$white.quotas", 0] }] }, then: "$$REMOVE", else: "$white" } },
          "black": { $cond: { if: { $or: [{ $eq: ["$black.lastQuota.quota", "$black.quotas"] }, { $eq: ["$black.quotas", 0] }] }, then: "$$REMOVE", else: "$black" } }
        }
      },
      {
        $project: {
          "ROOT": {
            $cond: {
              if: {
                $or: [
                  {
                    $ifNull: ["white", false]
                  },
                  {
                    $ifNull: ["black", false]
                  }
                ]
              },
              then: "$$ROOT",
              else: false
            }
          }
        }
      },
      { $match: { "ROOT": { $ne: false }, $or: [{ "ROOT.white": { $exists: true } }, { "ROOT.black": { $exists: true } }] } },
      { $sort: { "ROOT.apartment.unit": 1 } }

    ])

    return transactions.map((t, i) => t.ROOT)
  }
}

export default TransactionService