import mongoose from "mongoose"

const blackPaymentsCollection = "blackPayments"

const blackPaymentsSchema = new mongoose.Schema({
  currency: String,
  paid: Number,
  date: Date
})

export default mongoose.model(blackPaymentsCollection, blackPaymentsSchema)