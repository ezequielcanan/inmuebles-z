import Z_Router from "./router.js"
import { getProject, createProject, getProjects } from "../controllers/project.controller.js"
import { uploader } from "../utils.js"

export default class ProjectsRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN", "SECRETARY", "USER"], getProjects)
    this.get("/:pid", ["ADMIN", "SECRETARY", "USER"], getProject)

    this.post("/", ["ADMIN", "SECRETARY"], createProject)
    this.post("/file", ["ADMIN", "SECRETARY"], uploader.single("file"), (req, res) => res.sendSuccess("OK"))
  }
}