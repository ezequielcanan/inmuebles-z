import mongoose from "mongoose"

const taxSchema = new mongoose.Schema({
  percentage: { type: Number, required: true },
  month: Date
})

export default mongoose.model("taxes", taxSchema)