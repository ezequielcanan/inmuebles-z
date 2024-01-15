import Z_Router from "./router.js"
import passport from "passport"

export default class SessionRouter extends Z_Router {
  init() {

    this.post("/login", passport.authenticate("login", { session: false }), async (req, res) => {
      try {
        if (!req.user) return res.sendUserError("Invalid credentials")
        const { token } = req.user

        res.cookie("jwt", token).sendSuccess(true)
      }
      catch (e) {
        res.sendServerError(e)
      }
    })

    this.post("/register", passport.authenticate("register", { session: false }), async (req, res) => {
      try {
        return res.sendSuccess(true)
      } catch (e) {
        console.log(e)
        return res.sendServerError("Error: " + e)
      }
    })

    this.get("/error", (req, res) => {
      res.sendUserError(false)
    })

    this.get("/auth", passport.authenticate("jwt", { session: false }), (req, res) => {
      const { user } = req.user
      res.sendSuccess(user)
    })

  }
}