import { createTransfers, deleteTransfer, getFiles, updateTransfers } from "../controllers/transfer.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class TransferRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN"], createTransfers)
    this.post("/file", ["ADMIN"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/", ["ADMIN"], updateTransfers)
    this.patch("/file", ["ADMIN"], getFiles)
    this.delete("/file", ["ADMIN"], deleteTransfer)
  }
}