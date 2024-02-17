import { createBlackPayment, deleteBlackPayment, getBlackPayment, updateBlackPayment } from "../controllers/blackPayment.controller.js";
import Z_Router from "./router.js";

export default class BlackPaymentRouter extends Z_Router {
  init() {
    this.get("/:sid", ["ADMIN"], getBlackPayment)
    this.post("/:pid", ["ADMIN"], createBlackPayment)
    this.put("/:sid", ["ADMIN"], updateBlackPayment)
    this.delete("/:pid/:sid", ["ADMIN"], deleteBlackPayment)
  }
}