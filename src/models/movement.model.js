import mongoose from "mongoose"

const movementCollection = "movements"

const movementsSchema = new mongoose.Schema({
  date: Date,
  emissionDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  code: String,
  checkType: { type: String, enum: ["ECHEQ", "FISICO"] },
  movementType: { type: String, enum: ["Cheque", "Transferencia", "Pago Servicios"] },
  paid: Boolean,
  error: { type: Boolean, default: false },
  state: String,
  detail: { type: String, required: true },
  credit: Number,
  debit: Number,
  tax: Number,
  note: String,
  lastCheck: String,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
  cashAccount: { type: mongoose.Schema.Types.ObjectId, ref: "cashAccounts", required: false },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers", required: false },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "services", required: false },
})

movementsSchema.pre("find", function () {
  this.populate("cashAccount")
  this.populate("account")
  this.populate("supplier")
  this.populate("service")
})

export default mongoose.model(movementCollection, movementsSchema)