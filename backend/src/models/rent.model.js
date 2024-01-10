import mongoose from "mongoose"

const rentsCollection = "rents"

const rentsSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "apartments" },
  fromDate: Date,
  toDate: Date,
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "tenants" },
  value: Number,
  guaranteeFund: Number,
  intermediary: String,
  rentThumbnail: String
})

rentsSchema.pre("find", function() {
  this.populate("tenant")
})

rentsSchema.pre("findOne", function() {
  this.populate("tenant")
})

rentsSchema.pre("findById", function() {
  this.populate("tenant")
})

export default mongoose.model(rentsCollection, rentsSchema)