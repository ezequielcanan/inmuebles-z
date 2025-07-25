import mongoose from "mongoose"
import supplierModel from "../models/supplier.model.js"
import ownerModel from "../models/owner.model.js"

class SupplierService {
  constructor() { }

  createSupplier = async (supplier) => {
    const result = await supplier?._id ? supplierModel.findOneAndUpdate({ _id: supplier?._id }, { $set: { ...supplier } }, { upsert: true }) : supplierModel.create(supplier)
    const isOwner = await ownerModel.findOne({ name: supplier?.name }).lean().exec()
    !isOwner && await ownerModel.create({ name: supplier?.name, number: supplier?.phone, email: supplier?.email, ownerType: "Gremio" })
    return result
  }

  getSuppliers = async (pid = "") => {
    const condObj = !pid?.length ? { $eq: ["$$budget.supplier", "$_id"] } : { $and: [{ $eq: ["$$budget.supplier", "$_id"] }, { $eq: ["$$budget.project", new mongoose.Types.ObjectId(pid)] }] }
    const billsCondObj = !pid?.length ? { $eq: ["$$bill.receiver", "$_id"] } : { $and: [{ $eq: ["$$bill.receiver", "$_id"] }, { $eq: ["$$bill.project", new mongoose.Types.ObjectId(pid)] }] }
    const movementCondObj = { $eq: ["$$movement.supplier", "$_id"] }

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
        $lookup: {
          from: "bills",
          let: { receiver: "supplier" },
          pipeline: [
          ],
          as: "bills"
        }
      },
      {
        $lookup: {
          from: "movements",
          let: { supplier: "supplier" },
          pipeline: [
          ],
          as: "movements"
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
                cond: condObj
              }
            }
          },
          bills: {
            $size: {
              $filter: {
                input: "$bills",
                as: "bill",
                cond: billsCondObj
              }
            }
          },
          movements: {
            $size: {
              $filter: {
                input: "$movements",
                as: "movement",
                cond: movementCondObj
              }
            }
          }
        }
      },
      {
        $sort: { name: 1 }
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

  getSuppliersByProject = async (pid) => {

  }

  updateSupplier = async (sid, supplier) => supplierModel.updateOne({ _id: sid }, { $set: supplier })
  deleteSupplier = async (sid) => supplierModel.findOneAndDelete({ _id: sid }, { new: true })
}

export default SupplierService