import { createTransfers, deleteTransfer, getFiles, updateTransfers } from "../controllers/transfer.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class TransferRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "EXECUTIVE"], createTransfers)
    this.post("/file", ["ADMIN", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/", ["ADMIN", "EXECUTIVE"], updateTransfers)
    this.patch("/file", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getFiles)
    this.delete("/file", ["ADMIN", "EXECUTIVE"], deleteTransfer)
  }
}