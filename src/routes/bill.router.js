import { addBalanceNote, createBill, createBillWithoutPayment, deleteBalanceNote, deleteBill, getBill, getFiles, updateBalanceNote, updateBill, getBillsByProjectAndSupplier, payBill } from "../controllers/bill.controller.js"
import { uploader } from "../utils.js"
import Z_Router from "./router.js"

export default class BillRouter extends Z_Router {
  init() {
    this.get("/:bid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getBill)
    this.get("/:pid/:sid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getBillsByProjectAndSupplier)

    this.post("/", ["ADMIN", "EXECUTIVE"], createBillWithoutPayment)
    this.post("/:pid", ["ADMIN", "EXECUTIVE"], createBill)
    this.post("/:bid/pay", ["ADMIN", "BANK"], payBill)
    this.post("/balance-note/:bid", ["ADMIN", "EXECUTIVE", "BANK"], addBalanceNote)
    this.post("/file/:pid", ["ADMIN", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))

    this.patch("/file", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getFiles)

    this.put("/balance-note/:bid/:nid", ["ADMIN", "EXECUTIVE"], updateBalanceNote)
    this.put("/:bid", ["ADMIN", "EXECUTIVE", "BANK"], updateBill)

    this.delete("/:bid/:pid", ["ADMIN", "EXECUTIVE"], deleteBill)
    this.delete("/balance-note/:bid/:nid", ["ADMIN", "EXECUTIVE"], deleteBalanceNote)
  }
}