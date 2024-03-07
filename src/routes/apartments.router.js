import Z_Router from "./router.js"
import { uploader } from "../utils.js"
import { getAllFromFloor, createApartment, getApartmentById, updateApartment, getFiles, deleteFile, getAllFromProject } from "../controllers/apartment.controller.js"

export default class ApartmentRouter extends Z_Router {
  init() {
    this.get("/project/:pid", ["ADMIN", "SECRETARY", "EXECUTIVE", "BANK", "USER"], getAllFromProject)
    this.get("/floor/:fid", ["ADMIN", "SECRETARY", "EXECUTIVE", "BANK", "USER"], getAllFromFloor)
    this.get("/:aid", ["ADMIN", "SECRETARY", "EXECUTIVE", "BANK", "USER"], getApartmentById)
    this.get("/files/:type", ["ADMIN", "SECRETARY", "EXECUTIVE", "BANK", "USER"], getFiles)

    this.post("/", ["ADMIN", "EXECUTIVE", "SECRETARY"], createApartment)
    this.post("/file", ["ADMIN", "EXECUTIVE", "SECRETARY"], uploader.single("file"), (req, res) => res.sendSuccess(true))

    this.put("/:aid", ["ADMIN", "EXECUTIVE", "SECRETARY"], updateApartment)

    this.delete("/files", ["ADMIN", "EXECUTIVE", "SECRETARY"], deleteFile)
  }
}