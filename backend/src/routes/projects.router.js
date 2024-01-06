import { Router } from "express"
import { getAllFromProject, createProject } from "../controllers/project.controller.js"
import { uploader, createFolder } from "../utils.js"

const router = Router()

router.post("/", uploader.single("image"), createProject)

router.get("/:pid", getAllFromProject)

export default router