import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import projectsRouter from "./routes/projects.router.js"
import __dirname from "./utils.js"

dotenv.config() // .env config
const app = express()

// POST AND COOKIES
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/static", express.static(__dirname + "/public"))

app.use("/api/projects", projectsRouter)

// MONGO CONNECTION AND RUNNING SERVER
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB })
  .then(() => {
    app.listen(process.env.PORT, () => console.log("Running on port " + process.env.PORT))
  })
  .catch(e => console.error(e))


