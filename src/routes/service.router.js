import { createService, deleteService, getServiceById, getServices, updateService } from "../controllers/service.controller.js";
import Z_Router from "./router.js";

export default class ServiceRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createService)
    this.get("/project/:pid", ["ADMIN", "BANK", "USER", "EXECUTIVE", "SECRETARY"], getServices)
    this.get("/:sid", ["ADMIN", "BANK", "USER", "EXECUTIVE", "SECRETARY"], getServiceById)
    this.put("/:sid", ["ADMIN", "BANK"], updateService)
    this.delete("/:sid", ["ADMIN", "BANK"], deleteService)
  }
}