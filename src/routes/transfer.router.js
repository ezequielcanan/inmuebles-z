import { createTransfers, deleteTransfer, getFiles, updateTransfers } from "../controllers/transfer.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class TransferRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createTransfers)
    this.post("/file", ["ADMIN", "BANK", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/", ["ADMIN", "BANK"], updateTransfers)
    this.patch("/file", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getFiles)
    this.delete("/file", ["ADMIN", "BANK"], deleteTransfer)
  }
}