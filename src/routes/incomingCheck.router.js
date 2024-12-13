import { createIncomingCheck, getProjectChecks, getIncomingCheck, updateIncomingCheck, updateAllIncomingCheck, insertNewTransfer, deleteTransfer, getIncomingChecksExcel } from "../controllers/incomingCheck.controller.js";
import Z_Router from "./router.js";

export default class IncomingCheckRouter extends Z_Router {
  init() {
    this.post("/", ["ADMIN", "BANK"], createIncomingCheck)
    this.post("/transfer/:cid", ["ADMIN", "BANK"], insertNewTransfer)
    this.get("/project/:pid", ["ADMIN", "BANK"], getProjectChecks)
    this.get("/excel/:pid", ["ADMIN", "BANK"], getIncomingChecksExcel)
    this.get("/:cid", ["ADMIN", "BANK"], getIncomingCheck)
    this.put("/:cid", ["ADMIN", "BANK"], updateIncomingCheck)
    this.put("/all/:cid", ["ADMIN", "BANK"], updateAllIncomingCheck)
    this.delete("/transfer/:cid/:tid", ["ADMIN", "BANK"], deleteTransfer)
  }
}