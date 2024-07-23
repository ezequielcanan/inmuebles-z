import { createWhitePayment, deleteWhitePayment, getWhitePayment, updateWhitePayment } from "../controllers/whitePayment.controller.js";
import Z_Router from "./router.js";

export default class WhitePaymentRouter extends Z_Router {
  init() {
    this.get("/:sid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getWhitePayment)
    this.put("/:sid", ["ADMIN", "EXECUTIVE"], updateWhitePayment)
    this.post("/:pid", ["ADMIN", "EXECUTIVE"], createWhitePayment)

    this.delete("/:pid/:sid", ["ADMIN", "EXECUTIVE"], deleteWhitePayment)
  }
}