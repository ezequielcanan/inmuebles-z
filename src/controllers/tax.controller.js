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


export const getActualTax = async (req, res) => {
  try {
    const result = await taxService.getActualTax()
    res.sendSuccess(result[0])
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

export const deleteTax = async (req, res) => {
  try {
    const result = await taxService.deleteTax(req?.params?.tid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}