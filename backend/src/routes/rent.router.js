import Z_Router from "./router.js"
import { createRent } from "../controllers/rent.controller.js"

export default class RentRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN","SECRETARY"], createRent)
  }
}