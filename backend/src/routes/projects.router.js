import Z_Router from "./router.js"
import { getAllFromProject, createProject, getProjects } from "../controllers/project.controller.js"
import { uploader } from "../utils.js"

export default class ProjectsRouter extends Z_Router {
  init() {
    this.get("/", getProjects)
    this.post("/", uploader.single("file"), createProject)
    this.get("/", getProjects)
    this.get("/:pid", getAllFromProject)
  }
}