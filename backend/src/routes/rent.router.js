import Z_Router from "./router.js"
import { createRent, deleteRent } from "../controllers/rent.controller.js"

export default class RentRouter extends Z_Router {
  init() {
    this.delete("/:rid", ["ADMIN", "SECRETARY"], deleteRent)
    this.post("/", ["ADMIN", "SECRETARY"], createRent)
  }
}