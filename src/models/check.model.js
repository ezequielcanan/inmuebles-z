import mongoose from "mongoose"

const checkCollection = "checks"

const checkSchema = new mongoose.Schema({
  emissionDate: Date,
  expirationDate: Date,
  code: String,
  detail: String,
  amount: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }
})

checkSchema.pre("findOne", function () {
  this.populate("account")
})

checkSchema.pre("find", function () {
  this.populate("account")
})

export default mongoose.model(checkCollection, checkSchema)