import mongoose from "mongoose"

const projectsCollection = "projects"

const projectsSchema = new mongoose.Schema({
  title: String,
  address: String,
  type: { type: String, options: ["De pozo", "En desarrollo", "Finalizados"] },
  thumbnail: String
})

export default mongoose.model(projectsCollection, projectsSchema)