import mongoose from "mongoose"

const accountsCollection = "accounts"

const accountsSchema = new mongoose.Schema({
  cbu: String,
  bank: String,
  name: String,
  alias: String,
  cuit: String,
  accountNumber: String,
  initialBalance: { type: Number, default: 0 },
  society: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  signatories: {
    type: [
      {
        from: Date,
        to: Date,
        name: String
      }
    ],
    default: []
  }
})

accountsSchema.pre("find", function () {
  this.populate("society")
})

accountsSchema.pre("findOne", function () {
  this.populate("society")
})

export default mongoose.model(accountsCollection, accountsSchema)