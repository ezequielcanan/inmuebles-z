import passport from "passport"
import { changeUserNotificationsRole, getUserById, getUsers, toggleUserNotificationsPermission, updateUser } from "../controllers/user.controller.js"
import Z_Router from "./router.js"

export default class UserRouter extends Z_Router {
  init() {
    this.get("/", ["ADMIN", "USER", "SECRETARY", "EXECUTIVE"], getUsers)
    this.get("/current", ["ADMIN", "USER", "SECRETARY", "EXECUTIVE", "UNKNOW"], passport.authenticate("jwt", { session: false }), getUserById)
    this.put("/:uid", ["ADMIN"], updateUser)
    this.put("/:uid/notifications/:tid", ["ADMIN", "SECRETARY", "EXECUTIVE"], toggleUserNotificationsPermission)
    this.put("/:uid/notifications/:tid/role", ["ADMIN", "SECRETARY", "EXECUTIVE"], changeUserNotificationsRole)
  }
}