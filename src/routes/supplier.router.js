import { addSupplier, getSupplier, getSuppliers } from "../controllers/supplier.controller.js";
import Z_Router from "./router.js";

export default class SupplierRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN"], getSuppliers)
    this.get("/:sid", ["ADMIN"], getSupplier)
    this.post("/", ["ADMIN"], addSupplier)
  }
}