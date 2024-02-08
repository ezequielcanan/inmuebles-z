import { createPayment, getBudgetPayments, getExcelPayment, getPayment } from "../controllers/payment.controller.js";
import { uploader } from "../utils.js";
import Z_Router from "./router.js";

export default class PaymentRouter extends Z_Router {
  init() {
    this.get("/budget/:bid", ["ADMIN"], getBudgetPayments)
    this.get("/:pid", ["ADMIN"], getPayment)
    this.get("/excel/:pid", ["ADMIN"], getExcelPayment)
    this.post("/", ["ADMIN"], createPayment)
    this.post("/files", ["ADMIN"], uploader.array("files"), (req, res) => res.sendSuccess(req.body))
  }
}