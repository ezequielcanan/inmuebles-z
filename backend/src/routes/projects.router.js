import Z_Router from "./router.js"
import { getProject, createProject, getProjects } from "../controllers/project.controller.js"
import { uploader } from "../utils.js"

export default class ProjectsRouter extends Z_Router {
  init() {
    this.get("/", getProjects)
    this.get("/:pid", getProject)


    this.post("/", uploader.single("file"), createProject)
  }
}