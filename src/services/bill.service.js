import billModel from "../models/bill.model.js";
import PaymentService from "./payment.service.js";

const paymentService = new PaymentService();
class BillService {
  constructor() {}

  createBill = async (bill, payment) => {
    const result = await billModel.create(bill);
    const paymentResult = await paymentService.getPayment(payment);
    const updateObj = {
      "white.bill": result?._id
    };

    const updatePayment = await paymentService.updatePayment(payment, updateObj);
    return result;
  };
}

export default BillService;
