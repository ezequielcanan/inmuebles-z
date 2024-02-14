import mongoose from "mongoose"

const paymentsCollection = "payments"

const paymentsSchema = new mongoose.Schema({
  budget: { type: mongoose.Schema.Types.ObjectId, ref: "budgets" },
  paymentNumber: Number,
  percentageOfTotal: Number,
  balanceAdjustment: Number,
  amount: Number,
  discountByApartments: Number,
  total: Number,
  indexCac: Number,
  notes: {
    type: [
      {
        date: Date,
        note: String
      }
    ],
    default: []
  },
  white: {
    amount: Number,
    mcp: Number,
    mcd: Number,
    bills: {
      type: [
        {
          bill: { type: mongoose.Schema.Types.ObjectId, ref: "bills" },
          concept: { type: String, enum: ["mcd", "mcp", "certificate"] }
        }
      ],
      default: []
    },
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
  this.populate("white.bills.bill")
  this.populate("white.payments")
  this.populate("black.payments.payment")
})

paymentsSchema.pre("findOne", function () {
  this.populate("white.bills.bill")
  this.populate("white.payments")
  this.populate("black.payments")
  this.populate("budget")
})

export default mongoose.model(paymentsCollection, paymentsSchema)