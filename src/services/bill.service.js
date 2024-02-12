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

  getBillById = async (bid) => billModel.findOne({ _id: bid })
}

export default BillService;
