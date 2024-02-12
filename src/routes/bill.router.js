import { createBill, getBill } from "../controllers/bill.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class BillRouter extends Z_Router {
  init() {
    this.get("/:bid", ["ADMIN"], getBill)
    this.post("/:pid", ["ADMIN"], createBill)
    this.post("/file/:pid", ["ADMIN"], uploader.single("file"), (req, res) => res.sendSuccess(true))
  }
}