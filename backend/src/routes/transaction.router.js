import Z_Router from "./router.js";
import { createTransaction, getApartmentTransactions, getTransactionById, createTransactionXlsx } from "../controllers/transaction.controller.js";

export default class TransactionRouter extends Z_Router {
  init() {
    this.get("/apartment/:aid", getApartmentTransactions)
    this.get("/:tid", getTransactionById)
    this.get("/excel/:tid", createTransactionXlsx)
    this.post("/", createTransaction)
  }
}