import { isValidPassword } from "../utils.js"
import Z_Router from "./router.js"
import passport from "passport"

export default class SessionRouter extends Z_Router {
  init() {

    this.post("/login", ["ADMIN", "SECRETARY", "USER", "UNKNOW"], passport.authenticate("login", { session: false }), async (req, res) => {
      try {
        if (!req.user) return res.sendUserError("Invalid credentials")
        const { token } = req.user

        res.cookie("jwt", token).sendSuccess(true)
      }
      catch (e) {
        res.sendServerError(e)
      }
    })

    this.post("/register", ["ADMIN", "SECRETARY", "USER", "UNKNOW"], passport.authenticate("register", { session: false }), async (req, res) => {
      try {
        return res.sendSuccess(true)
      } catch (e) {
        console.log(e)
        return res.sendServerError("Error: " + e)
      }
    })

    this.get("/error", ["ADMIN", "SECRETARY", "USER", "UNKNOW"], (req, res) => {
      res.sendUserError(false)
    })

    this.get("/auth", ["ADMIN", "SECRETARY", "USER", "UNKNOW"], passport.authenticate("jwt", { session: false }), (req, res) => {
      const { user } = req.user
      res.sendSuccess(user)
    })

    this.get("/check-password/:pass", ["ADMIN", "SECRETARY", "USER", "UNKNOW"], passport.authenticate("jwt", { session: false }), async (req, res) => {
      const { user } = req?.user
      if (!isValidPassword(user, req?.params?.pass)) return res.sendUserError(false)
      res.sendSuccess(true)
    })
  }
}