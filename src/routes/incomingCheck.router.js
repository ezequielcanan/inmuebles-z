import { createIncomingCheck } from "../controllers/incomingCheck.controller.js";
import Z_Router from "./router.js";

export default class IncomingCheckRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createIncomingCheck)
  }
}