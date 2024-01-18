import Z_Router from "./router.js";
import { createTransaction, getApartmentTransactions, getTransactionById, createTransactionXlsx, createFutureQuotasXlsx } from "../controllers/transaction.controller.js";

export default class TransactionRouter extends Z_Router {
  init() {
    this.get("/apartment/:aid", ["ADMIN", "SECRETARY", "USER"], getApartmentTransactions)
    this.get("/:tid", ["ADMIN", "SECRETARY", "USER"], getTransactionById)
    this.get("/excel/:tid", ["ADMIN", "SECRETARY", "USER"], createTransactionXlsx)
    this.get("/excel/project/:pid", ["ADMIN", "SECRETARY", "USER"], createFutureQuotasXlsx)
    this.post("/", ["ADMIN", "SECRETARY"], createTransaction)
  }
}