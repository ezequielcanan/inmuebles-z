import mongoose from "mongoose"

const movementCollection = "movements"

const movementsSchema = new mongoose.Schema({
  emissionDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  code: String,
  movementType: {type: String, enum: ["Cheque", "Transferencia"]},
  paid: Boolean,
  detail: { type: String, required: true },
  credit: Number,
  debit: Number,
  tax: Number,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
  cashAccount: { type: mongoose.Schema.Types.ObjectId, ref: "cashAccounts", required: false },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers", required: false }
})

movementsSchema.pre("find", function () {
  this.populate("account")
})

export default mongoose.model(movementCollection, movementsSchema)