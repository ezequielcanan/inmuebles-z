import AccountService from "../services/account.service.js"
import MovementsService from "../services/movements.service.js"
import { getAccountExcel } from "../excel/payments.js"

const movementsService = new MovementsService()
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

export const getExcelAccount = async (req, res) => {
  try {
    const { aid } = req?.params
    const account = await accountService.getAccountById(aid)
    const movements = await movementsService.getAccountMovements(aid, req?.query?.filter == "true", false)

    const wb = getAccountExcel(account, movements)
    wb.write(`BANCO ${account?.society?.title} - ${account?.bank || ""}.xlsx`, res)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}