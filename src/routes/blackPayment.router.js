import { createBlackPayment } from "../controllers/blackPayment.controller.js";
import Z_Router from "./router.js";

export default class BlackPaymentRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN"], createBlackPayment)
  }
}