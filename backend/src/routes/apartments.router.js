import Z_Router from "./router.js"
import { uploader } from "../utils.js"
import { getAllFromFloor, createApartment, getApartmentById, updateApartment, getFiles, deleteFile } from "../controllers/apartment.controller.js"

export default class ApartmentRouter extends Z_Router {
  init() {
    this.get("/floor/:fid", ["ADMIN","SECRETARY","USER"], getAllFromFloor)
    this.get("/:aid", ["ADMIN","SECRETARY","USER"], getApartmentById)
    this.get("/files/:type", ["ADMIN","SECRETARY","USER"], getFiles)

    this.post("/", ["ADMIN","SECRETARY"], createApartment)
    this.post("/file", ["ADMIN","SECRETARY"], uploader.single("file"), (req, res) => res.sendSuccess(true))

    this.put("/:aid", ["ADMIN","SECRETARY"], updateApartment)

    this.delete("/files", ["ADMIN","SECRETARY"], deleteFile)
  }
}