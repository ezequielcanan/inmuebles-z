import Z_Router from "./router.js"
import { getAllFromFloor, createApartment, getApartmentById, updateApartment } from "../controllers/apartment.controller.js"

export default class ApartmentRouter extends Z_Router {
  init() {
    this.get("/floor/:fid", getAllFromFloor)
    this.get("/:aid", getApartmentById)
    this.post("/", createApartment)
    this.put("/:aid", updateApartment)
  }
}