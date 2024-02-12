import mongoose from "mongoose"

const billsCollection = "bills"

const billsSchema = new mongoose.Schema({
  code: String,
  emissionDate: Date,
  amount: Number,
  iva: Number,
  taxes: Number,
  notes: {
    type: [
      {
        type: { type: String, enum: ["debit", "credit"] },
        amount: Number,
        date: Date
      }
    ]
  },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" }
})

export default mongoose.model(billsCollection, billsSchema)