import transactionModel from "../models/transaction.model.js"
import quotaModel from "../models/quota.model.js"
import mongoose from "mongoose"

class TransactionService {
  constructor() { }

  createTransaction = async (data) => {
    const result = await transactionModel.create(data)
    return result
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
    const result = await transactionModel.updateOne({_id: tid}, update)
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
      { $unwind: '$apartment.floor' },
      {
        $lookup: {
          from: "owners",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        }
      },
      { $unwind: '$buyer' },
      {
        $lookup: {
          from: "quotas",
          localField: "white.lastQuota",
          foreignField: "_id",
          as: "white.lastQuota",
        }
      },
      { $unwind: '$white.lastQuota' },
      {
        $lookup: {
          from: "quotas",
          localField: "black.lastQuota",
          foreignField: "_id",
          as: "black.lastQuota",
        }
      },
      { $addFields: { "black.lastQuota": "$black.lastQuota" } },
      { $unwind: '$black.lastQuota' },
      {
        $set: {
          "white": { $cond: { if: { $eq: ["$white.lastQuota.quota", "$white.quotas"] }, then: "$$REMOVE", else: "$white" } },
          "black": { $cond: { if: { $eq: ["$black.lastQuota.quota", "$black.quotas"] }, then: "$$REMOVE", else: "$black" } }
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