import tenantModel from "../models/tenant.model.js"

class TenantService {
  constructor() {}

  createTentant = async (data) => {
    const filter = {}
    data._id && (filter._id = data._id)
    let result = await tenantModel.findOneAndUpdate(filter,{...data},{upsert: true})
    result == null && (result = await tenantModel.findOne({tenantNumber: data?.tenantNumber}))
    return result
  }

  getTenant = async (tid) => {
    const tenant = await tenantModel.findOne({_id: tid})
    return tenant
  }
}

export default TenantService