import TransferService from "../services/transfer.service.js"

const transferService = new TransferService()

export const createTransfers = async (req, res) => {
  try {
    const result = await transferService.createTransfers(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}


export const getFiles = (req,res) => {
  try {
    const result = transferService.getFiles(req?.body?.thumbnail)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}