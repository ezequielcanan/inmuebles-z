import mongoose from "mongoose"

const tenantsCollection = "tenants"

const tenantsSchema = new mongoose.Schema({
  name: String,
  number: {type: Number, unique: true},
  tenantThumbnail: String
})

export default mongoose.model(tenantsCollection, tenantsSchema)