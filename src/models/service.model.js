import mongoose from "mongoose"

const servicesCollection = "services"

const servicesSchema = new mongoose.Schema({
  name: String,
  code: String
})

export default mongoose.model(servicesCollection, servicesSchema)