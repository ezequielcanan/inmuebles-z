import mongoose from "mongoose"

const servicesCollection = "services"

const servicesSchema = new mongoose.Schema({
  name: String,
  code: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects", required: false },
  description: String,
  plan: Boolean,
  firstVep: Boolean
})

servicesSchema.pre("findOne", function () {
  this.populate("project")
})

export default mongoose.model(servicesCollection, servicesSchema)