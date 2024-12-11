import mongoose from "mongoose"

const incomingCheckCollection = "incomingChecks"

const incomingChecksSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  date: Date,
  emissionDate: Date,
  expirationDate: Date,
  receivedDate: Date,
  operationDate: Date,
  code: String,
  origin: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owners" },
  cashAccount: { type: mongoose.Schema.Types.ObjectId, ref: "cashAccounts" },
  specialFrom: String,
  detail: { type: String, required: true },
  amount: Number,
  state: String,
  checkType: { type: String, enum: ["ECHEQ", "FISICO"] },
  transferDetail: String,
  transfers: {
    type: [
      {
        date: Date,
        subject: String
      }
    ],
    default: []
  }
})

incomingChecksSchema.pre("find", function () {
  this.populate("cashAccount")
  this.populate("owner")
})

export default mongoose.model(incomingCheckCollection, incomingChecksSchema)