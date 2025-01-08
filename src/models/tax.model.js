import mongoose from "mongoose"

const taxSchema = new mongoose.Schema({
  percentage: { type: Number, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  month: Date
})

export default mongoose.model("taxes", taxSchema)