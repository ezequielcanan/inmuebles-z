import { createMovement, deleteMovement, getAccountMovements, updateMovement } from "../controllers/movement.controller.js";
import Z_Router from "./router.js";

export default class MovementRouter extends Z_Router {
  init() {
    this.get("/:aid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getAccountMovements)

    this.post("/", ["ADMIN", "BANK"], createMovement)

    this.put("/:mid", ["ADMIN", "BANK"], updateMovement)

    this.delete("/:mid", ["ADMIN", "BANK"], deleteMovement)
  }
}