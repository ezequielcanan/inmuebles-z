import passport from "passport"
import local from "passport-local"
import userModel from "../models/user.model.js"
import passportJWT from "passport-jwt"
import { createHash, generateToken, isValidPassword, jwtSign } from "../utils.js"

const LocalStrategy = local.Strategy
const JWTStrategy = passportJWT.Strategy

const cookieExtractor = (req) => {
  return req?.cookies?.jwt || null
}

const initializePassport = () => {
  passport.use("register", new LocalStrategy({
    passReqToCallback: true,
    usernameField: "email"
  }, async (req, username, password, done) => {
    const { name } = req.body
    try {
      const user = await userModel.findOne({ email: username }).lean().exec()
      if (user) {
        console.log("User already exists")
        return done(null, false)
      }

      const newUser = {
        email: username,
        password: createHash(password),
        name,
        role: username == "hire60@yahoo.com.ar" ? "admin" : "unknow",
      }

      const result = await userModel.create(newUser)
      return done(null, result)
    }
    catch (e) {
      return done("Error: " + e)
    }
  }))

  passport.use("login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username }).lean().exec()
      if (!user) {
        console.log("User doesn't exist, please register")
        return done(null, false)
      }

      if (!isValidPassword(user, password)) {
        console.log("Incorrect password")
        return done(null, false)
      }

      const token = generateToken(user)
      user.token = token

      return done(null, user)
    }
    catch (e) {
      return done("Error: " + e)
    }
  }))

  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: jwtSign
  }, (payload, done) => {
    done(null, payload)
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id).lean().exec()
    done(null, user)
  })
}

export default initializePassport