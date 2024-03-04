import { createAccount, getAccounts, getAccountById, updateAccount } from "../controllers/account.controller.js";
import Z_Router from "./router.js";

export default class AccountRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "EXECUTIVE"], createAccount)
    this.get("/", ["ADMIN", "EXECUTIVE", "USER"], getAccounts)
    this.get("/:aid", ["ADMIN", "EXECUTIVE", "USER"], getAccountById)
    this.put("/:aid", ["ADMIN", "EXECUTIVE"], updateAccount)
  }
}