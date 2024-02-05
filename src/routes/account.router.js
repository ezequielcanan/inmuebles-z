import { createAccount, getAccounts } from "../controllers/account.controller.js";
import Z_Router from "./router.js";

export default class AccountRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN"], createAccount)
    this.get("/", ["ADMIN"], getAccounts)
  }
}