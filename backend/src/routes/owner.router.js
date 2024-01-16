import Z_Router from "./router.js"
import { createOwner, ownerTextSearch, getOwnerApartments } from "../controllers/owner.controller.js"

export default class OwnerRouter extends Z_Router {
  init() {
    this.get("/apartments/:oid", ["ADMIN","SECRETARY","USER"], getOwnerApartments)
    this.get("/", ["ADMIN","SECRETARY","USER"], ownerTextSearch)
    this.post("/", ["ADMIN","SECRETARY"], createOwner)
  }
}