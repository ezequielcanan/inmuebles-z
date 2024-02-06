import { createBudget, getBudgets, getBudgetFiles, getBudget, updateBudget } from "../controllers/budget.controller.js";
import { uploader } from "../utils.js";
import Z_Router from "./router.js";

export default class BudgetRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN"], getBudgets)
    this.get("/:bid", ["ADMIN"], getBudget)
    this.get("/file/:pid/:bid", ["ADMIN"], getBudgetFiles)
    this.post("/", ["ADMIN"], createBudget)
    this.post("/file", ["ADMIN"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/:bid", ["ADMIN"], updateBudget)
  }
}