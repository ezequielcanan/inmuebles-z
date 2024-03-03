import mongoose from "mongoose"

const movementCollection = "movements"

const movementsSchema = new mongoose.Schema({
  emissionDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  checkCode: String,
  detail: { type: String, required: true },
  credit: Number,
  debit: Number,
  tax: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }
})

export default mongoose.model(movementCollection, movementsSchema)