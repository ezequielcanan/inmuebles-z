import mongoose from "mongoose"

const ownersCollection = "owners"

const ownersSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  number: String,
  email: String,
  ownerType: { type: String, enum: ["Gremio", "Accionista", "Particular", "Sociedad"] }
})

ownersSchema.index({ name: "text" })

export default mongoose.model(ownersCollection, ownersSchema)