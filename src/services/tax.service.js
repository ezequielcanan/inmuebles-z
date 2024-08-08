import taxModel from "../models/tax.model.js"

class TaxService {
  constructor() { }

  createTax = tax => taxModel.create(tax)
  getTaxes = () => taxModel.find()
  updateTax = (tid, tax) => taxModel.updateOne({ _id: tid }, { $set: { tax } })
}

export default TaxService