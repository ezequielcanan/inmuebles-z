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
  detail: String,
  amount: Number,
  state: String,
  checkType: { type: String, enum: ["ECHEQ", "FISICO"] },
  transferDetail: String,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
  transfer: {
    type: {
      supplier: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
      cashAccount: { type: mongoose.Schema.Types.ObjectId, ref: "cashAccounts" },
      other: String
    }
  },
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
  this.populate("project")
  this.populate("account")
  this.populate("transfer.supplier")
  this.populate("transfer.cashAccount")
})

incomingChecksSchema.pre("findOne", function () {
  this.populate("cashAccount")
  this.populate("owner")
  this.populate("project")
  this.populate("account")
  this.populate("transfer.supplier")
  this.populate("transfer.cashAccount")
})

export default mongoose.model(incomingCheckCollection, incomingChecksSchema)