import Z_Router from "./router.js"
import { getAllFromFloor, createApartment } from "../controllers/apartment.controller.js"

export default class ApartmentRouter extends Z_Router {
  init() {
    this.get("/floor/:fid", getAllFromFloor)
    this.post("/", createApartment)
  }
}