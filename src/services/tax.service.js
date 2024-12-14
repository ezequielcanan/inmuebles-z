import taxModel from "../models/tax.model.js"

class TaxService {
  constructor() { }

  createTax = tax => taxModel.create(tax)
  getTaxes = () => taxModel.find().sort({month: "desc"})
  getActualTax = () => taxModel.find().sort({month: "desc"}).limit(1)
  updateTax = (tid, tax) => taxModel.updateOne({ _id: tid }, { $set: { tax } })
  deleteTax = (tid) => taxModel.deleteOne({_id: tid})
}

export default TaxService