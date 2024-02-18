import { createChecks, deleteCheck, getFiles, updateChecks } from "../controllers/check.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class CheckRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "EXECUTIVE"], createChecks)
    this.post("/file", ["ADMIN", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/", ["ADMIN", "EXECUTIVE"], updateChecks)
    this.patch("/file", ["ADMIN", "EXECUTIVE", "USER"], getFiles)
    this.delete("/file", ["ADMIN", "EXECUTIVE"], deleteCheck)
  }
}