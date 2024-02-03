import mongoose from "mongoose"

const budgetsCollection = "budgets"

const budgetsSchema = new mongoose.Schema({
  total: Number,
  project: {type: mongoose.Schema.Types.ObjectId, ref: "projects"},
  supplier: {type: mongoose.Schema.Types.ObjectId, ref: "suppliers"},
  percentage: Number,
  paymentType: {type: String, enum: ["quotas", "advance"]}
})

export default mongoose.model(budgetsCollection, budgetsSchema)