import { createBlackPayment, deleteBlackPayment, getBlackPayment, updateBlackPayment } from "../controllers/blackPayment.controller.js";
import Z_Router from "./router.js";

export default class BlackPaymentRouter extends Z_Router {
  init() {
    this.get("/:sid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getBlackPayment)
    this.post("/:pid", ["ADMIN", "EXECUTIVE"], createBlackPayment)
    this.put("/:sid", ["ADMIN", "EXECUTIVE"], updateBlackPayment)
    this.delete("/:pid/:sid", ["ADMIN", "EXECUTIVE"], deleteBlackPayment)
  }
}