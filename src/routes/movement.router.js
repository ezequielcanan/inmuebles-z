import { createMovement, deleteMovement, getAccountMovements, getExpiredChecks, getServiceExcel, getSupplierExcel, updateMovement } from "../controllers/movement.controller.js";
import Z_Router from "./router.js";

export default class MovementRouter extends Z_Router {
  init() {
    this.get("/:aid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getAccountMovements)
    this.get("/:sid/:pid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getSupplierExcel)
    this.get("/excel/service/:sid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getServiceExcel)
    this.get("/expired/:aid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getExpiredChecks)


    this.post("/", ["ADMIN", "BANK"], createMovement)

    this.put("/:mid", ["ADMIN", "BANK"], updateMovement)

    this.delete("/:mid", ["ADMIN", "BANK"], deleteMovement)
  }
}