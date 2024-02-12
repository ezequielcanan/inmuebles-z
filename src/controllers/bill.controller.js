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