import mongoose from "mongoose"

const projectsCollection = "projects"

const projectsSchema = new mongoose.Schema({
  title: String,
  address: String,
  thumbnail: String
})

export default mongoose.model(projectsCollection, projectsSchema)