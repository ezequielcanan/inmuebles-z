import transferModel from "../models/transfer.model.js";
import fs from "fs"
import __dirname from "../utils.js"


class TransferService {
  constructor() { }

  createTransfer = async (transfer) => {
    const result = await transferModel.create(transfer)
    return result
  };

  createTransfers = async (transfers) => {
    const result = await transferModel.insertMany(transfers)
    return result
  }

  getFiles = (thumbnail) => {
    const files = []
    fs.readdirSync(__dirname + thumbnail).forEach(file => files.push(file))
    return files
  }
}

export default TransferService;
