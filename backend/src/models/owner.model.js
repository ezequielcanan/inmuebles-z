import mongoose from "mongoose"

const ownersCollection = "owners"

const ownersSchema = new mongoose.Schema({
  name: String,
  number: Number,
  email: String,
  address: String,
  ownerType: {type: String, enum: ["Gremio", "Accionista", "Particular", "Sociedad"]},
  cuit: {type: Number, unique: true}
})

export default mongoose.model(ownersCollection, ownersSchema)