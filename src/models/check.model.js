import mongoose from "mongoose"

const checkCollection = "checks"

const checkSchema = new mongoose.Schema({
  emissionDate: Date,
  expirationDate: Date,
  code: String,
  amount: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }
})

export default mongoose.model(checkCollection, checkSchema)