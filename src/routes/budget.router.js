import { createBudget, getBudgets, getBudgetFiles, getBudget, updateBudget, addNote, updateNote, deleteNote, getBudgetExcel, getBudgetsBySuppliers, getBudgetBlackExcel } from "../controllers/budget.controller.js";
import { uploader } from "../utils.js";
import Z_Router from "./router.js";

export default class BudgetRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN"], getBudgets)
    this.get("/:bid", ["ADMIN"], getBudget)
    this.get("/supplier/:sid", ["ADMIN"], getBudgetsBySuppliers)
    this.get("/file/:pid/:bid", ["ADMIN"], getBudgetFiles)
    this.get("/excel/:bid", ["ADMIN"], getBudgetExcel)
    this.get("/excel/b/:bid", ["ADMIN"], getBudgetBlackExcel)
    this.post("/", ["ADMIN"], createBudget)
    this.post("/:bid/notes", ["ADMIN"], addNote)
    this.post("/file", ["ADMIN"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/:bid", ["ADMIN"], updateBudget)
    this.put("/:bid/notes/:nid", ["ADMIN"], updateNote)
    this.delete("/:bid/notes/:nid", ["ADMIN"], deleteNote)
  }
}