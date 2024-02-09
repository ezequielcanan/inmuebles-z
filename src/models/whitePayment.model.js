import mongoose from "mongoose"

const whitePaymentsCollection = "whitePayments"

const whitePaymentsSchema = new mongoose.Schema({
  date: Date,
  transfers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "transfers" }
  ],
  checks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "checks" }
  ],
  retention: {
    amount: Number,
    code: Number
  }
})

whitePaymentsSchema.pre("find", function () {
  this.populate("checks")
})

whitePaymentsSchema.pre("findOne", function () {
  this.populate("checks")
})


export default mongoose.model(whitePaymentsCollection, whitePaymentsSchema)