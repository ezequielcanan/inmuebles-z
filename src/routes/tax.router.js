import { createTax, getTaxes, updateTax } from "../controllers/tax.controller.js";
import Z_Router from "./router.js";

export default class TaxRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createTax)
    this.get("/", ["ADMIN", "BANK", "USER", "EXECUTIVE", "SECRETARY"], getTaxes)
    this.put("/:sid", ["ADMIN", "BANK"], updateTax)
  }
}