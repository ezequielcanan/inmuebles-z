import mongoose from "mongoose"

const paymentsCollection = "payments"

const paymentsSchema = new mongoose.Schema({
  budget: {type: mongoose.Schema.Types.ObjectId, ref: "budgets"},
  amount: Number,
  cashPaid: Number,
  checks: [
   {type: mongoose.Schema.Types.ObjectId, ref: "checks"}
  ],
  bill: {type: mongoose.Schema.Types.ObjectId, ref: "bills"}
})