import billModel from "../models/bill.model.js";
import PaymentService from "./payment.service.js";

const paymentService = new PaymentService();
class BillService {
  constructor() { }

  createBill = async (bill, payment) => {
    const result = await billModel.create(bill);
    const paymentResult = await paymentService.getPayment(payment);

    const updatePayment = await paymentService.inserBill(payment, { bill: result?._id, concept: bill.concept });
    return result;
  };

  addBalanceNote = async (bid, note) => billModel.findOneAndUpdate({_id: bid}, {$push: {"notes": note}}, {new: true})

  updateBalanceNote = async (bid, nid, note) => {
    const updateObj = {}
    Object.entries(note).forEach((entry) => {
      updateObj[`notes.$.${entry[0]}`] = entry[1]
    })
    return billModel.findOneAndUpdate({_id: bid, "notes._id": nid}, {$set: updateObj}, {new: true})
  }

  getBillById = async (bid) => billModel.findOne({ _id: bid })
}

export default BillService;
