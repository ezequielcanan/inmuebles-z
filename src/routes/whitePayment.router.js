import { createWhitePayment, deleteWhitePayment, getWhitePayment, updateWhitePayment } from "../controllers/whitePayment.controller.js";
import Z_Router from "./router.js";

export default class WhitePaymentRouter extends Z_Router {
  init() {
    this.get("/:sid", ["ADMIN"], getWhitePayment)
    this.put("/:sid", ["ADMIN"], updateWhitePayment)
    this.post("/:pid", ["ADMIN"], createWhitePayment)

    this.delete("/:pid/:sid", ["ADMIN"], deleteWhitePayment)
  }
}