import cashAccountModel from "../models/cashAccount.model.js"

class CashAccountService {
  constructor() { }

  createAccount = (account) => cashAccountModel.create(account)
  getAccounts = () => cashAccountModel.find()
  deleteAccount = (aid) => cashAccountModel.deleteOne({ _id: aid })
}

export default CashAccountService