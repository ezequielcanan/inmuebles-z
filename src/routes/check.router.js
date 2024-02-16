import { createChecks, deleteCheck, getFiles, updateChecks } from "../controllers/check.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class CheckRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN"], createChecks)
    this.post("/file", ["ADMIN"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/", ["ADMIN"], updateChecks)
    this.patch("/file", ["ADMIN"], getFiles)
    this.delete("/file", ["ADMIN"], deleteCheck)
  }
}