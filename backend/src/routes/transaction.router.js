import Z_Router from "./router.js";
import { createTransaction, getApartmentTransactions } from "../controllers/transaction.controller.js";

export default class TransactionRouter extends Z_Router {
  init() {
    this.get("/:aid", getApartmentTransactions)
    this.post("/", createTransaction)
  }
}