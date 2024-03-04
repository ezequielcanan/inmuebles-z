import mongoose from "mongoose"

const transferCollection = "transfers"

const transferSchema = new mongoose.Schema({
  emissionDate: Date,
  code: String,
  detail: String,
  amount: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }
})

transferSchema.pre("findOne", function () {
  this.populate("account")
})

transferSchema.pre("find", function () {
  this.populate("account")
})

export default mongoose.model(transferCollection, transferSchema)