import { createPayment, getBudgetPayments, getExcelPayment, getPayment, addNote, updateNote, deleteNote, deletePayment } from "../controllers/payment.controller.js";
import { uploader } from "../utils.js";
import Z_Router from "./router.js";

export default class PaymentRouter extends Z_Router {
  init() {
    this.get("/budget/:bid", ["ADMIN", "EXECUTIVE", "USER"], getBudgetPayments)
    this.get("/:pid", ["ADMIN", "EXECUTIVE", "USER"], getPayment)
    this.get("/excel/:pid", ["ADMIN", "EXECUTIVE", "USER"], getExcelPayment)
    this.post("/", ["ADMIN", "EXECUTIVE"], createPayment)
    this.post("/:pid/notes", ["ADMIN", "EXECUTIVE"], addNote)
    this.post("/files", ["ADMIN", "EXECUTIVE"], uploader.array("files"), (req, res) => res.sendSuccess(req.body))
    this.put("/:pid/notes/:nid", ["ADMIN", "EXECUTIVE"], updateNote)
    this.delete("/:pid/notes/:nid", ["ADMIN", "EXECUTIVE"], deleteNote)
    this.delete("/:pid", ["ADMIN", "EXECUTIVE"], deletePayment)
  }
}