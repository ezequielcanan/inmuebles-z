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
    bill: { type: mongoose.Schema.Types.ObjectId, ref: "bills" },
    payments: {
      type: [
        {
          payment: { type: mongoose.Schema.Types.ObjectId, ref: "whitePayments" }
        }
      ]
    }
  },
  black: {
    amount: Number,
    payments: {
      type: [
        {
          payment: { type: mongoose.Schema.Types.ObjectId, ref: "blackPayments" }
        }
      ]
    }
  }
})

paymentsSchema.pre("find", function () {
  this.populate("white.bill")
  this.populate("white.payments.payment")
  this.populate("black.payments.payment")
})

paymentsSchema.pre("findOne", function () {
  this.populate("white.bill")
  this.populate("white.payments.payment")
  this.populate("black.payments.payment")
  this.populate("budget")
})

export default mongoose.model(paymentsCollection, paymentsSchema)