import CashAccountService from "../services/cashAccount.service.js"

const cashAccountService = new CashAccountService()

export const createCashAccount = async (req, res) => {
  try {
    const result = await cashAccountService.createAccount(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getCashAccounts = async (req, res) => {
  try {
    const result = await cashAccountService.getAccounts()
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteCashAccount = async (req, res) => {
  try {
    const result = await cashAccountService.deleteAccount(req?.params?.aid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}