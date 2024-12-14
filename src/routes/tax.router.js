import { createTax, getTaxes, updateTax, deleteTax, getActualTax } from "../controllers/tax.controller.js";
import Z_Router from "./router.js";

export default class TaxRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createTax)
    this.get("/", ["ADMIN", "BANK", "USER", "EXECUTIVE", "SECRETARY"], getTaxes)
    this.get("/actual", ["ADMIN", "BANK", "USER", "EXECUTIVE", "SECRETARY"], getActualTax)
    this.put("/:tid", ["ADMIN", "BANK"], updateTax)
    this.delete("/:tid", ["ADMIN", "BANK"], deleteTax)
  }
}