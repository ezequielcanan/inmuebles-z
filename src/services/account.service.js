import accountModel from "../models/account.model.js"

class AccountService {
  constructor() {}

  createAccount = async (account) => {
    const result = await accountModel.create(account)
    return result
  }
}

export default AccountService