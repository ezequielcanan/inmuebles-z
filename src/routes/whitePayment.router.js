import { createWhitePayment } from "../controllers/whitePayment.controller.js";
import Z_Router from "./router.js";

export default class WhitePaymentRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN"], createWhitePayment)
  }
}