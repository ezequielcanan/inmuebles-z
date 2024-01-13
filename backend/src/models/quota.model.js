import mongoose from "mongoose"

const quotaCollection = "quotas"

const quotaSchema = new mongoose.Schema({
  cac: Number,
  total: Number,
  quota: Number,
  type: { type: String, enum: ["white", "black"] },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "transactions" },
  date: String
})

quotaSchema.pre("findOne", function () {
  this.populate("transaction")
})

export default mongoose.model(quotaCollection, quotaSchema)