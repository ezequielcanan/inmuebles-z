import quotaModel from "../models/quota.model"

class QuotaService {
  constructor() {}

  createQuota = async (data) => {
    const result = await quotaModel.create(data)
    return result
  }

  getQuotaById = async (qid) => {
    const result = await quotaModel.findOne({_id: qid})
    return result
  }

  getTransactionQuotas = async (tid) => {
    const result = await quotaModel.find({transaction:tid})
    return result
  }
}