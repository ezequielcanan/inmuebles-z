import Z_Router from "./router.js"
import { createFloor, getFloor, getProjectFloors, deleteFloor } from "../controllers/floor.controller.js"

export default class FloorRouter extends Z_Router {
  init() {
    this.post("/project/:pid", ["ADMIN", "SECRETARY"], createFloor)
    this.get("/project/:pid", ["ADMIN", "SECRETARY", "USER"], getProjectFloors)
    this.get("/:fid", ["ADMIN", "SECRETARY", "USER"], getFloor)

    this.delete("/:fid", ["ADMIN", "SECRETARY"], deleteFloor)
  }
}