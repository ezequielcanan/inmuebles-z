import whitePaymentModel from "../models/whitePayment.model.js";

export default class WhitePaymentService {
  constructor() { }

  createWhitePayment = (payment) => whitePaymentModel.create(payment)
}