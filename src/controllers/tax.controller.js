import TaxService from "../services/tax.service.js"

const taxService = new TaxService()

export const createTax = async (req, res) => {
  try {
    const result = await taxService.createTax(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getTaxes = async (req, res) => {
  try {
    const result = await taxService.getTaxes()
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateTax = async (req, res) => {
  try {
    const result = await taxService.updateTax(req?.params?.tid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}