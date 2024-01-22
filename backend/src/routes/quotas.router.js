import { createQuota, getQuotasByTransaction } from "../controllers/quota.controller.js"
import Z_Router from "./router.js";

export default class QuotaRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "SECRETARY"], createQuota)
    this.get("/:tid", ["ADMIN", "SECRETARY", "USER"], getQuotasByTransaction)
  }
}