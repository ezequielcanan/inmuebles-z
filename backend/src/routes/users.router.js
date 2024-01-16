import { getUsers, updateUser } from "../controllers/user.controller.js"
import Z_Router from "./router.js"

export default class UserRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN"], getUsers)
    this.put("/:uid", ["ADMIN"], updateUser)
  }
}