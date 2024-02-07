import mongoose from "mongoose"

const whitePaymentsCollection = "whitePayments"

const whitePaymentsSchema = new mongoose.Schema({
  cashPaid: {
    type: {
      total: Number,
      account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" }
    }
  },
  date: Date,
  checks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "checks" }
  ],
  retention: Number
})

whitePaymentsSchema.pre("find", function () {
  this.populate("checks")
})

whitePaymentsSchema.pre("findOne", function () {
  this.populate("checks")
})


export default mongoose.model(whitePaymentsCollection, whitePaymentsSchema)