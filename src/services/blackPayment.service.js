import blackPaymentModel from "../models/blackPayment.model.js";

export default class BlackPaymentService {
  constructor() { }

  createBlackPayment = async (payment) => blackPaymentModel.create(payment)
}