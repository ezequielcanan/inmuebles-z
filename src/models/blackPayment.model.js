import mongoose from "mongoose"

const blackPaymentsCollection = "blackPayments"

const blackPaymentsSchema = new mongoose.Schema({
  dollarPrice: Number,
  cashPaid: Number,
  currency: { type: String, enum: ["dollar", "pesos"] },
  date: Date
})

export default mongoose.model(blackPaymentsCollection, blackPaymentsSchema)