import BillService from "../services/bill.service.js"

const billService = new BillService()

export const createBill = async (req, res) => {
  try {
    const result = await billService.createBill(req?.body, req?.params?.pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const createBillWithoutPayment = async (req, res) => {
  try {
    const result = await billService.createBillWithoutPayment(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getBill = async (req, res) => {
  try {
    const result = await billService.getBillById(req?.params?.bid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getBillsByProjectAndSupplier = async (req, res) => {
  try {
    const result = await billService.getBillsByProjectAndSupplier(req?.params?.pid, req?.params?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const addBalanceNote = async (req, res) => {
  try {
    const result = await billService.addBalanceNote(req?.params?.bid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateBalanceNote = async (req, res) => {
  try {
    const result = await billService.updateBalanceNote(req?.params?.bid, req?.params?.nid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteBill = async (req, res) => {
  try {
    const { bid, pid } = req.params
    const result = await billService.deleteBill(bid, pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateBill = async (req, res) => {
  try {
    const result = await billService.updateBill(req?.params?.bid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getFiles = (req, res) => {
  try {
    const result = billService.getFiles(req?.body?.thumbnail)
    res.sendSuccess(result)
  }
  catch (e) {
    if (e.code == "ENOENT") return res.sendNotFoundError()
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteBalanceNote = async (req, res) => {
  try {
    const result = await billService.deleteBalanceNote(req?.params?.bid, req?.params?.nid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const payBill = async (req,res) => {
  try {
    const result = await billService.updateBill(req?.params?.bid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}