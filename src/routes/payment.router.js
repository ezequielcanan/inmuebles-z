import { createPayment, getBudgetPayments, getExcelPayment, getPayment, addNote, updateNote, deleteNote } from "../controllers/payment.controller.js";
import { uploader } from "../utils.js";
import Z_Router from "./router.js";

export default class PaymentRouter extends Z_Router {
  init() {
    this.get("/budget/:bid", ["ADMIN"], getBudgetPayments)
    this.get("/:pid", ["ADMIN"], getPayment)
    this.get("/excel/:pid", ["ADMIN"], getExcelPayment)
    this.post("/", ["ADMIN"], createPayment)
    this.post("/:pid/notes", ["ADMIN"], addNote)
    this.post("/files", ["ADMIN"], uploader.array("files"), (req, res) => res.sendSuccess(req.body))
    this.put("/:pid/notes/:nid", ["ADMIN"], updateNote)
    this.delete("/:pid/notes/:nid", ["ADMIN"], deleteNote)
  }
}