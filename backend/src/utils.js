import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs"
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("./src/public/" + req.body?.thumbnail)) {
      fs.mkdirSync("./src/public/" + req.body?.thumbnail, { recursive: true })
    }
    cb(null, `./src/public/${req.body?.thumbnail}/`)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

export const uploader = multer({ storage })