import Z_Router from "./router.js"
import { getProject, createProject, getProjects, createExcelProject, getApartmentsByRooms, getProjectTotalMeters, getProjectTotalUnits } from "../controllers/project.controller.js"
import { uploader } from "../utils.js"

export default class ProjectsRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN", "SECRETARY", "EXECUTIVE", "USER"], getProjects)
    this.get("/:pid", ["ADMIN", "SECRETARY", "EXECUTIVE", "USER"], getProject)
    this.get("/excel/:pid", ["ADMIN", "SECRETARY", "EXECUTIVE", "USER"], createExcelProject)
    this.get("/rooms/:rooms/:pid", ["ADMIN", "SECRETARY", "EXECUTIVE", "USER"], getApartmentsByRooms)
    this.get("/meters/:pid", ["ADMIN", "SECRETARY", "EXECUTIVE", "USER"], getProjectTotalMeters)
    this.get("/units/:pid", ["ADMIN", "SECRETARY", "EXECUTIVE", "USER"], getProjectTotalUnits)

    this.post("/", ["ADMIN", "SECRETARY"], createProject)
    this.post("/file", ["ADMIN", "SECRETARY"], uploader.single("file"), (req, res) => res.sendSuccess("OK"))
  }
}