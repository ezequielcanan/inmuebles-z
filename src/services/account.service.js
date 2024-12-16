import accountModel from "../models/account.model.js"

class AccountService {
  constructor() { }

  createAccount = async (account) => {
    const result = await accountModel.create(account)
    return result
  }

  getAccounts = async (project) => {
    const findObj = {}
    if (project) findObj["society"] = project
    return accountModel.find(findObj)
  }

  getAccountById = async (aid) => accountModel.findOne({ _id: aid })

  updateAccount = async (aid, account) => accountModel.updateOne({ _id: aid }, { $set: account })
}

export default AccountService