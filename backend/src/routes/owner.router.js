import Z_Router from "./router.js"
import { createOwner } from "../controllers/owner.controller.js"

export default class OwnerRouter extends Z_Router {
  init() {
    this.post("/", createOwner)
  }
}