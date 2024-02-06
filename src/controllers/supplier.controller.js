import SupplierService from "../services/supplier.service.js"

const supplierService = new SupplierService()
export const addSupplier = async (req, res) => {
  try {
    const result = await supplierService.createSupplier(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getSuppliers = async (req, res) => {
  try {
    const result = await supplierService.getSuppliers()
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getSupplier = async (req, res) => {
  try {
    const result = await supplierService.getSupplier(req?.params?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}