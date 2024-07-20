import cashAccountModel from "../models/cashAccount.model.js"

class CashAccountService {
  constructor() { }

  createAccount = (account) => cashAccountModel.create(account)
  getAccounts = () => cashAccountModel.find()
  getAccount = (cid) => cashAccountModel.findOne({_id: cid})
  deleteAccount = (aid) => cashAccountModel.deleteOne({ _id: aid })
}

export default CashAccountService