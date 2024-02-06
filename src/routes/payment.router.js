import { createPayment, getBudgetPayments, getPayment } from "../controllers/payment.controller.js";
import Z_Router from "./router.js";

export default class PaymentRouter extends Z_Router {
  init() {
    this.get("/budget/:bid", ["ADMIN"], getBudgetPayments)
    this.get("/:pid", ["ADMIN"], getPayment)
    this.post("/", ["ADMIN"], createPayment)
  }
}