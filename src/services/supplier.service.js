import supplierModel from "../models/supplier.model.js"

class SupplierService {
  constructor() {}

  createSupplier = async (supplier) => {
    const result = await supplier?._id ? supplierModel.findOneAndUpdate({_id: supplier?._id}, {$set: {...supplier}}, {upsert: true}) : supplierModel.create(supplier)
    return result
  }
}

export default SupplierService