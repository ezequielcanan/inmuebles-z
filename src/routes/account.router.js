import { createAccount, getAccounts, getAccountById, updateAccount, getExcelAccount } from "../controllers/account.controller.js";
import Z_Router from "./router.js";

export default class AccountRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createAccount)
    this.get("/", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getAccounts)
    this.get("/:aid", ["ADMIN", "EXECUTIVE", "BANK", "USER"], getAccountById)
    this.get("/excel/:aid", ["ADMIN", "EXECUTIVE", "BANK", "SECRETARY", "USER"], getExcelAccount)
    this.put("/:aid", ["ADMIN", "BANK"], updateAccount)
  }
}