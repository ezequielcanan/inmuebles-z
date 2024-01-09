import mongoose from "mongoose"

const rentsCollection = "rents"

const rentsSchema = new mongoose.Schema({
  apartment: {type: mongoose.Schema.Types.ObjectId, ref: "apartments"},
  fromDate: Date,
  toDate: Date,
  tenant: {type: mongoose.Schema.Types.ObjectId, ref: "tenants"},
  value: Number,
  guaranteeFund: Number,
  intermediary: String,
  rentThumbnail: String
})

export default mongoose.model(rentsCollection, rentsSchema)