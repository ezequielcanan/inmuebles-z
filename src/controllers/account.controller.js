import AccountService from "../services/account.service.js"

const accountService = new AccountService()
export const getAccounts = async (req, res) => {
  try {
    const result = await accountService.getAccounts()
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getAccountById = async (req, res) => {
  try {
    const result = await accountService.getAccountById(req?.params?.aid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const createAccount = async (req, res) => {
  try {
    const result = await accountService.createAccount(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateAccount = async (req, res) => {
  try {
    const result = await accountService.updateAccount(req?.params?.aid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}