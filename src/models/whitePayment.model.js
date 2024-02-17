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
    code: String
  },
  materials: {
    amount: Number,
    material: String,
    date: Date
  }
})

whitePaymentsSchema.pre("find", function () {
  this.populate("checks")
  this.populate("transfers")
})

whitePaymentsSchema.pre("findOne", function () {
  this.populate("checks")
  this.populate("transfers")
})

whitePaymentsSchema.pre("findOneAndDelete", function () {
  this.populate("checks")
  this.populate("transfers")
})


export default mongoose.model(whitePaymentsCollection, whitePaymentsSchema)