import { createCashAccount, deleteCashAccount, getCashAccounts } from "../controllers/cashAccount.controller.js";
import Z_Router from "./router.js";

export default class CashAccountRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createCashAccount)
    this.get("/", ["ADMIN", "BANK", "USER", "EXECUTIVE", "SECRETARY"], getCashAccounts)
    this.delete("/:aid", ["ADMIN", "BANK"], deleteCashAccount)
  }
}