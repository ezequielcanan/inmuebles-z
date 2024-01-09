import mongoose from "mongoose"

const ownersCollection = "owners"

const ownersSchema = new mongoose.Schema({
  name: String,
  number: String,
  email: String,
  ownerType: { type: String, enum: ["Gremio", "Accionista", "Particular", "Sociedad"] }
})

export default mongoose.model(ownersCollection, ownersSchema)