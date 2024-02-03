import mongoose from "mongoose"

const paymentsCollection = "payments"

const paymentsSchema = new mongoose.Schema({
  budget: {type: mongoose.Schema.Types.ObjectId, ref: "budgets"},
  percentageOfTotal: Number,
  amount: Number,
  addition: Number,
  discountByApartments: Number,
  total: Number,
  indexCac: Number,
  white: {type: {
    cashPaid: {type: {
      total: Number,
      account: {type: mongoose.Schema.Types.ObjectId, ref: "accounts"}
    }},
    date: Date,
    checks: [
      {type: mongoose.Schema.Types.ObjectId, ref: "checks"}
    ],
    bill: {type: mongoose.Schema.Types.ObjectId, ref: "bills"},
  }},
  black: {type: {
    currency: String,
    paid: Number,
    date: Date
  }}
})


export default mongoose.model(paymentsCollection, paymentsSchema)