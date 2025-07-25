import moment from "moment";
import taxModel from "../models/tax.model.js"

class TaxService {
  constructor() { }

  createTax = tax => taxModel.create(tax)
  getTaxes = (project) => taxModel.find({ project }).sort({ month: "desc" })
  getActualTax = (project) => taxModel.find({ project }).sort({ month: "desc" }).limit(1)
  getMonthTax = (date, project) => taxModel.findOne({
    project,
    $expr: {
      $and: [
        { $eq: [{ $month: "$month" }, moment(date).month() + 1] },
        { $eq: [{ $year: "$month" }, moment(date).year()] }
      ]
    }
  });
  updateTax = (tid, tax) => taxModel.updateOne({ _id: tid }, { $set: { tax } })
  deleteTax = (tid) => taxModel.deleteOne({ _id: tid })
}

export default TaxService