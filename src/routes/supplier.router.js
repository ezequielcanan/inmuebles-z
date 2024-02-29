import { addSupplier, getSupplier, getSuppliers, deleteSupplier, updateSupplier } from "../controllers/supplier.controller.js";
import Z_Router from "./router.js";

export default class SupplierRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN", "EXECUTIVE", "USER"], getSuppliers)
    this.get("/:sid", ["ADMIN", "EXECUTIVE", "USER"], getSupplier)
    this.post("/", ["ADMIN", "EXECUTIVE"], addSupplier)
    this.put("/:sid", ["ADMIN", "EXECUTIVE"], updateSupplier)
    this.delete("/:sid", ["ADMIN", "EXECUTIVE"], deleteSupplier)
  }
}