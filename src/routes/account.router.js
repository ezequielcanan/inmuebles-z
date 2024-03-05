import { createAccount, getAccounts, getAccountById, updateAccount, getExcelAccount } from "../controllers/account.controller.js";
import Z_Router from "./router.js";

export default class AccountRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "EXECUTIVE"], createAccount)
    this.get("/", ["ADMIN", "EXECUTIVE", "USER"], getAccounts)
    this.get("/:aid", ["ADMIN", "EXECUTIVE", "USER"], getAccountById)
    this.get("/excel/:aid", ["ADMIN", "EXECUTIVE", "SECRETARY", "USER"], getExcelAccount)
    this.put("/:aid", ["ADMIN", "EXECUTIVE"], updateAccount)
  }
}