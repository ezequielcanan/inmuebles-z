import { createChecks } from "../controllers/check.controller.js"
import Z_Router from "./router.js"

export default class CheckRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN"], createChecks)
  }
}