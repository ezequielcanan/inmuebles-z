import mongoose from "mongoose"

const movementCollection = "movements"

const movementsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  checkCode: String,
  detail: { type: String, required: true },
  credit: Number,
  debit: Number,
  tax: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }
})

export default mongoose.model(movementCollection, movementsSchema)