import mongoose from "mongoose"

const suppliersCollection = "suppliers"

const suppliersSchema = new mongoose.Schema({
  name: String,
  cuit: String,
  email: String,
  phone: String,
  address: String,
  referrer: String
})

export default mongoose.model(suppliersCollection, suppliersSchema)