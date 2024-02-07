import mongoose from "mongoose"

const paymentsCollection = "payments"

const paymentsSchema = new mongoose.Schema({
  budget: { type: mongoose.Schema.Types.ObjectId, ref: "budgets" },
  paymentNumber: Number,
  percentageOfTotal: Number,
  amount: Number,
  discountByApartments: Number,
  total: Number,
  indexCac: Number,
  white: {
    amount: Number,
    mcp: Number,
    mcd: Number,
    bill: { type: mongoose.Schema.Types.ObjectId, ref: "bills" },
    payments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "whitePayments" }]
    }
  },
  black: {
    amount: Number,
    mcp: Number,
    mcd: Number,
    payments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "blackPayments" }
    ]
  }
})

paymentsSchema.pre("find", function () {
  this.populate("white.bill")
  this.populate("white.payments")
  this.populate("black.payments.payment")
})

paymentsSchema.pre("findOne", function () {
  this.populate("white.bill")
  this.populate("white.payments")
  this.populate("black.payments")
  this.populate("budget")
})

export default mongoose.model(paymentsCollection, paymentsSchema)