import accountModel from "../models/account.model.js"

class AccountService {
  constructor() { }

  createAccount = async (account) => {
    const result = await accountModel.create(account)
    return result
  }

  getAccounts = async () => accountModel.find()

  getAccountById = async (aid) => accountModel.findOne({ _id: aid })
}

export default AccountService