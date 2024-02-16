import { addBalanceNote, createBill, deleteBill, getBill, getFiles, updateBalanceNote, updateBill } from "../controllers/bill.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class BillRouter extends Z_Router {
  init() {
    this.get("/:bid", ["ADMIN"], getBill)

    this.post("/:pid", ["ADMIN"], createBill)
    this.post("/balance-note/:bid", ["ADMIN"], addBalanceNote)
    this.post("/file/:pid", ["ADMIN"], uploader.single("file"), (req, res) => res.sendSuccess(true))

    this.patch("/file", ["ADMIN"], getFiles)

    this.put("/balance-note/:bid/:nid", ["ADMIN"], updateBalanceNote)
    this.put("/:bid", ["ADMIN"], updateBill)

    this.delete("/:bid/:pid", ["ADMIN"], deleteBill)
  }
}