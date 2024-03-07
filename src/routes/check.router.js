import { createChecks, deleteCheck, getFiles, updateChecks } from "../controllers/check.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class CheckRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createChecks)
    this.post("/file", ["ADMIN", "BANK", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/", ["ADMIN", "BANK"], updateChecks)
    this.patch("/file", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getFiles)
    this.delete("/file", ["ADMIN", "BANK"], deleteCheck)
  }
}