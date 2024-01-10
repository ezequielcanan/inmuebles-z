import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs"
import multer from "multer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const data = JSON.parse(req.body?.data)
    req.data = data
    if (!fs.existsSync("./src/public/" + data?.folder)) {
      fs.mkdirSync("./src/public/" + data?.folder, { recursive: true })
    }
    cb(null, `./src/public/${data?.folder}/`)
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, (req.data?.title || req.data?.name || req.data?.tenant) ? (req.data?.title || req.data?.name || req.data?.tenant) + ext : file.originalname)
  }
})

export const uploader = multer({ storage })