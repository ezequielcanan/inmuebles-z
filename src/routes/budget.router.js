import { createBudget, getBudgets, getBudgetFiles, getBudget, updateBudget, addNote, updateNote, deleteNote, getBudgetExcel, getBudgetsBySuppliers, getBudgetBlackExcel, deleteFile, getBudgetsByProjects } from "../controllers/budget.controller.js";
import { uploader } from "../utils.js";
import Z_Router from "./router.js";

export default class BudgetRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN", "EXECUTIVE", "USER"], getBudgets)
    this.get("/:bid", ["ADMIN", "EXECUTIVE", "USER"], getBudget)
    this.get("/supplier/:sid", ["ADMIN", "EXECUTIVE", "USER"], getBudgetsBySuppliers)
    this.get("/project/:pid", ["ADMIN", "EXECUTIVE", "USER"], getBudgetsByProjects)
    this.get("/file/:pid/:bid", ["ADMIN", "EXECUTIVE", "USER"], getBudgetFiles)
    this.get("/excel/:bid", ["ADMIN", "EXECUTIVE", "USER"], getBudgetExcel)
    this.get("/excel/b/:bid", ["ADMIN", "EXECUTIVE", "USER"], getBudgetBlackExcel)
    this.post("/", ["ADMIN", "EXECUTIVE"], createBudget)
    this.post("/:bid/notes", ["ADMIN", "EXECUTIVE"], addNote)
    this.post("/file", ["ADMIN", "EXECUTIVE"], uploader.single("file"), (req, res) => res.sendSuccess(true))
    this.put("/:bid", ["ADMIN", "EXECUTIVE"], updateBudget)
    this.put("/:bid/notes/:nid", ["ADMIN", "EXECUTIVE"], updateNote)
    this.delete("/:bid/notes/:nid", ["ADMIN", "EXECUTIVE"], deleteNote)
    this.delete("/file", ["ADMIN", "EXECUTIVE"], deleteFile)
  }
}