import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs"
import multer from "multer";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

export const jwtSign = "ezequiel"

export const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
  return jwt.sign({ user }, jwtSign, { expiresIn: "24h" });
};

export const authorization = role => {
  return async (req, res, next) => {
    const user = req.user
    if (!user) return res.status(401).send({ error: 'Unauthorized' })
    if (user.user.role != role) return res.status(403).send({ error: 'No permisions' })
    return next()
  }
}

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
    cb(null, (req.data?.id || req.data?.title || req.data?.name || req.data?.tenant) ? (req.data?.id || req.data?.title || req.data?.name || req.data?.tenant) + ext : file.originalname)
  }
})

export const uploader = multer({ storage })