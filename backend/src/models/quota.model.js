import mongoose from "mongoose"

const quotaCollection = "quotas"

const quotaSchema = new mongoose.Schema({
  cac: Number,
  indexCac: Number,
  total: Number,
  quota: Number,
  type: { type: String, enum: ["white", "black"] },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "transactions" },
  adjustment: Number,
  extraAdjustment: Number,
  date: String,
  dollarPrice: Number,
  paid: Number,
  paidUSD: Number,
  balance: Number,
  interest: Number
})

quotaSchema.pre("findOne", function () {
  this.populate("transaction")
})

quotaSchema.pre("find", function () {
  this.populate("transaction")
})

export default mongoose.model(quotaCollection, quotaSchema)