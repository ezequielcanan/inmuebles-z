import Z_Router from "./router.js"
import { getProject, createProject, getProjects, createExcelProject } from "../controllers/project.controller.js"
import { uploader } from "../utils.js"

export default class ProjectsRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN", "SECRETARY", "USER"], getProjects)
    this.get("/:pid", ["ADMIN", "SECRETARY", "USER"], getProject)
    this.get("/excel/:pid", ["ADMIN", "SECRETARY", "USER"], createExcelProject)

    this.post("/", ["ADMIN", "SECRETARY"], createProject)
    this.post("/file", ["ADMIN", "SECRETARY"], uploader.single("file"), (req, res) => res.sendSuccess("OK"))
  }
}