import QuotaService from "../services/quota.service.js"

const quotaService = new QuotaService()

export const createQuota = async (req, res) => {
  try {
    const result = await quotaService.createQuota(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}