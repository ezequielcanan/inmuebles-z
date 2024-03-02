import mongoose from "mongoose"

const billsCollection = "bills"

const billsSchema = new mongoose.Schema({
  code: String,
  emissionDate: Date,
  amount: Number,
  iva: Number,
  taxes: Number,
  cuit: String,
  type: {type: String, enum: ["A", "B", "C"]},
  hasCertificate: {type: Boolean, default: true},
  notes: {
    type: [
      {
        type: { type: String, enum: ["debit", "credit"] },
        amount: Number,
        date: Date,
        code: String
      }
    ]
  },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" }
})

export default mongoose.model(billsCollection, billsSchema)