import mongoose from "mongoose"

const floorsCollection = "floors"

const floorsSchema = new mongoose.Schema({
  title: String,
  floorThumbnail: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  index: Number
})

export default mongoose.model(floorsCollection, floorsSchema)