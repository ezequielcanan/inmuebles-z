import mongoose from "mongoose"

const movementCollection = "movements"

const movementsSchema = new mongoose.Schema({
  date: Date,
  emissionDate: { type: Date, required: false },
  expirationDate: { type: Date, required: false },
  code: String,
  checkType: { type: String, enum: ["ECHEQ", "FISICO"] },
  movementType: { type: String, enum: ["Cheque", "Transferencia", "Pago Servicios", "Gastos Bancarios", "VEP"] },
  paid: Boolean,
  error: { type: Boolean, default: false },
  state: String,
  detail: { type: String, required: false },
  credit: Number,
  debit: Number,
  tax: Number,
  note: String,
  lastCheck: String,
  account: { type: mongoose.Schema.Types.ObjectId, ref: "accounts" },
  cashAccount: { type: mongoose.Schema.Types.ObjectId, ref: "cashAccounts", required: false },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers", required: false },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "services", required: false },
  incomingCheck: { type: mongoose.Schema.Types.ObjectId, ref: "incomingChecks", required: false },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects", required: false },
  dollar: Boolean,
  notShows: { type: Boolean, default: false }
})

movementsSchema.pre("find", function () {
  this.populate("cashAccount")
  this.populate("account")
  this.populate("supplier")
  this.populate("service")
  this.populate("incomingCheck")
  this.populate("project")
})

movementsSchema.pre("findOne", function () {
  this.populate("cashAccount")
  this.populate("account")
  this.populate("project")
  this.populate("supplier")
  this.populate("service")
  this.populate("incomingCheck")
})

export default mongoose.model(movementCollection, movementsSchema)