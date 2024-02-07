import billModel from "../models/bill.model.js"
import PaymentService from "./payment.service.js"

const paymentService = new PaymentService()
class BillService {
  constructor() {}

  createBill = async (bill, payment) => {
    const result = await billModel.create(bill)
    const paymentResult = await paymentService.getPayment(payment)
    const updatePayment = await paymentService.updatePayment(payment, {"white.bill": result?._id, "white.amount": paymentResult?.white?.amount + (result?.iva * paymentResult?.white?.amount / 100)})
    return result
  }
}

export default BillService