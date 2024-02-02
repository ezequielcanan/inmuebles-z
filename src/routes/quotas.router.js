import { createQuota, getQuotasByTransaction, undoQuota } from "../controllers/quota.controller.js"
import Z_Router from "./router.js";

export default class QuotaRouter extends Z_Router {
  init() {
    this.get("/:tid", ["ADMIN", "SECRETARY", "USER"], getQuotasByTransaction)
    this.post("/", ["ADMIN", "SECRETARY"], createQuota)
    this.put("/:qid", ["ADMIN", "SECRETARY"], undoQuota)
  }
}