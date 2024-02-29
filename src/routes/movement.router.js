import { createMovement, deleteMovement, getAccountMovements, updateMovement } from "../controllers/movement.controller.js";
import Z_Router from "./router.js";

export default class MovementRouter extends Z_Router {
  init() {
    this.get("/:aid", ["ADMIN", "EXECUTIVE", "USER"], getAccountMovements)

    this.post("/", ["ADMIN", "EXECUTIVE"], createMovement)

    this.put("/:mid", ["ADMIN", "EXECUTIVE"], updateMovement)

    this.delete("/:mid", ["ADMIN", "EXECUTIVE"], deleteMovement)
  }
}