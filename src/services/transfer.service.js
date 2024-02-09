import transferModel from "../models/transfer.model.js";

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
}

export default TransferService;
