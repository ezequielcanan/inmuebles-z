import billModel from "../models/bill.model.js"

class BillService {
  constructor() {}

  createBill = async (bill) => {
    const result = await bill?._id ? billModel.findOneAndUpdate({_id: bill?._id}, {$set: {...bill}}, {upsert: true}) : billModel.create(bill)
    return result
  }
}

export default BillService