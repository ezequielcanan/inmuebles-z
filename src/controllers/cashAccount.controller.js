import { getCashAccountExcel } from "../excel/payments.js"
import CashAccountService from "../services/cashAccount.service.js"
import MovementsService from "../services/movements.service.js"

const cashAccountService = new CashAccountService()
const movementsService = new MovementsService()

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

export const getExcelCashAccount = async (req, res) => {
  try {
    let movements = await movementsService.getCashAccountMovements(req?.params?.cid)
    movements = movements.sort((a,b) => new Date(a.emissionDate) - new Date(b.emissionDate))
    const account = await cashAccountService.getAccount(req?.params?.cid)


    const wb = getCashAccountExcel(account, movements)
    wb.write(`${account?.name} BANCOS.xlsx`, res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}