import { createWhitePayment, getWhitePayment } from "../controllers/whitePayment.controller.js";
import Z_Router from "./router.js";

export default class WhitePaymentRouter extends Z_Router {
  init() {
    this.get("/:sid", ["ADMIN"], getWhitePayment)
    this.post("/:pid", ["ADMIN"], createWhitePayment)
  }
}