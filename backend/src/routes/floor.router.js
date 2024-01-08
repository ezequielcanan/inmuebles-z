import Z_Router from "./router.js"
import { createFloor, getFloor, getProjectFloors } from "../controllers/floor.controller.js"

export default class FloorRouter extends Z_Router {
  init() {
    this.post("/project/:pid", createFloor)
    this.get("/project/:pid", getProjectFloors)
    this.get("/:fid", getFloor)
  }
}