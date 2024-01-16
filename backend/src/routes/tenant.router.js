import Z_Router from "./router.js"
import { createTenant } from "../controllers/tenant.controller.js"

export default class TenantRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN","SECRETARY"], createTenant)
  }
}