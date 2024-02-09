import mongoose from "mongoose"

const transferCollection = "transfers"

const transferSchema = new mongoose.Schema({
  emissionDate: Date,
  code: String,
  amount: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }
})

export default mongoose.model(transferCollection, transferSchema)