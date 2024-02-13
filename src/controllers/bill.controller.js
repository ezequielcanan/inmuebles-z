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