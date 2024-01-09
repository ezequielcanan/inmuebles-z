import TenantService from "../services/tenant.service.js"

const tenantService = new TenantService()
export const createTenant = async (req, res) => {
  try {
    const result = await tenantService.createTentant(req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}