import mongoose from "mongoose"
import supplierModel from "../models/supplier.model.js"

class SupplierService {
  constructor() { }

  createSupplier = async (supplier) => {
    const result = await supplier?._id ? supplierModel.findOneAndUpdate({ _id: supplier?._id }, { $set: { ...supplier } }, { upsert: true }) : supplierModel.create(supplier)
    return result
  }

  getSuppliers = async () => {
    const result = await supplierModel.aggregate([
      {
        $lookup: {
          from: "budgets",
          let: { supplier: "supplier" },
          pipeline: [
          ],
          as: "budgets"
        }
      },
      {
        $project: {
          name: 1,
          referrer: 1,
          budgets: {
            $size: {
              $filter: {
                input: "$budgets",
                as: "budget",
                cond: { $eq: ["$$budget.supplier", "$_id"] }
              }
            }
          }
        }
      }
    ])

    return result

  }

  getSupplier = async (sid) => {
    const result = await supplierModel.aggregate([
      {
        $match: { "_id": new mongoose.Types.ObjectId(sid) }
      },
      {
        $lookup: {
          from: "budgets",
          let: { supplier: "supplier" },
          pipeline: [
          ],
          as: "budgets"
        }
      },
      {
        $project: {
          name: 1,
          referrer: 1,
          cuit: 1,
          email: 1,
          phone: 1,
          address: 1,
          budgets: {
            $filter: {
              input: "$budgets",
              as: "budget",
              cond: { $eq: ["$$budget.supplier", "$_id"] }
            }
          }
        }
      }
    ])

    return result ? result[0] : undefined
  }
}

export default SupplierService