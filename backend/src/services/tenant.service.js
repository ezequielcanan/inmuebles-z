import tenantModel from "../models/tenant.model.js"

class TenantService {
  constructor() {}

  createTentant = async (data) => {
    const result = await tenantModel.create(data)
    return result
  }

  getTenant = async (tid) => {
    const tenant = await tenantModel.findOne({_id: tid})
    return tenant
  }
}

export default TenantService