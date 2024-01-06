import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs"
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;


const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null, `./src/public/${req.body?.thumbnail}/`)
  },
  filename: (req,file,cb) => {
    cb(null, req.body?.thumbnail + file.originalname)
  }
})

export const createFolder = (req,res,next) => {
  if (!fs.existsSync("./src/public/" + req.body?.thumbnail)) {
    fs.mkdirSync("./src/public/" + req.body?.thumbnail)
  }
}

export const uploader = multer({storage})