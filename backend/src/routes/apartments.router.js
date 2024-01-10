import Z_Router from "./router.js"
import { uploader } from "../utils.js"
import { getAllFromFloor, createApartment, getApartmentById, updateApartment, getPhotos, deleteFile } from "../controllers/apartment.controller.js"

export default class ApartmentRouter extends Z_Router {
  init() {
    this.get("/floor/:fid", getAllFromFloor)
    this.get("/:aid", getApartmentById)
    this.get("/files/photos", getPhotos)

    this.post("/", createApartment)
    this.post("/photo", uploader.single("file"), (req, res) => res.sendSuccess(true))

    this.put("/:aid", updateApartment)

    this.delete("/files", deleteFile)
  }
}