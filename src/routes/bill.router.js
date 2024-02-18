import { addBalanceNote, createBill, deleteBill, getBill, getFiles, updateBalanceNote, updateBill } from "../controllers/bill.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class BillRouter extends Z_Router {
  init() {
    this.get("/:bid", ["ADMIN", "EXECUTIVE", "USER"], getBill)

    this.post("/:pid", ["ADMIN", "EXECUTIVE"], createBill)
    this.post("/balance-note/:bid", ["ADMIN", "EXECUTIVE"], addBalanceNote)
    this.post("/file/:pid", ["ADMIN", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))

    this.patch("/file", ["ADMIN", "EXECUTIVE", "USER"], getFiles)

    this.put("/balance-note/:bid/:nid", ["ADMIN", "EXECUTIVE"], updateBalanceNote)
    this.put("/:bid", ["ADMIN", "EXECUTIVE"], updateBill)

    this.delete("/:bid/:pid", ["ADMIN", "EXECUTIVE"], deleteBill)
  }
}