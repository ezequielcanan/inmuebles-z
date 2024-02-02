import mongoose from "mongoose"

const tenantsCollection = "tenants"

const tenantsSchema = new mongoose.Schema({
  tenantName: String,
  tenantNumber: String,
  tenantThumbnail: String
})

export default mongoose.model(tenantsCollection, tenantsSchema)