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

export const getQuotasByTransaction = async (req, res) => {
  try {
    const result = await quotaService.getTransactionQuotas(req?.params?.tid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const undoQuota = async (req, res) => {
  try {
    const result = await quotaService.deleteQuotaAndUpdateTransaction(req?.params?.qid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateQuota = async (req, res) => {
  try {
    const result = await quotaService.updateQuota(req?.params?.qid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}