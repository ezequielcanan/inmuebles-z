import { createPayment, getBudgetPayments, getExcelPayment, getPayment, addNote, updateNote, deleteNote, deletePayment, deleteFile, getPaymentFiles, getProjectSupplierPayments } from "../controllers/payment.controller.js";
import { uploader } from "../utils.js";
import Z_Router from "./router.js";

export default class PaymentRouter extends Z_Router {
  init() {
    this.get("/budget/:bid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getBudgetPayments)
    this.get("/project/:pid/:sid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getProjectSupplierPayments)
    this.get("/:pid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getPayment)
    this.get("/excel/:pid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getExcelPayment)
    this.get("/file/:projectId/:bid/:pid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getPaymentFiles)
    this.post("/", ["ADMIN", "EXECUTIVE"], createPayment)
    this.post("/:pid/notes", ["ADMIN", "EXECUTIVE"], addNote)
    this.post("/file", ["ADMIN", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.post("/files", ["ADMIN", "EXECUTIVE"], uploader.array("files"), (req, res) => res.sendSuccess(req.body))
    this.put("/:pid/notes/:nid", ["ADMIN", "EXECUTIVE"], updateNote)
    this.delete("/:pid/notes/:nid", ["ADMIN", "EXECUTIVE"], deleteNote)
    this.delete("/:pid", ["ADMIN", "EXECUTIVE"], deletePayment)
    this.delete("/file/:pid", ["ADMIN", "EXECUTIVE"], deleteFile)
  }
}