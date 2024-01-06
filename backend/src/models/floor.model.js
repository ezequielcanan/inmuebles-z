import mongoose from "mongoose"

const floorsCollection = "floors"

const floorsSchema = new mongoose.Schema({
  title: String,
  floorThumbnail: String,
  project: {type: mongoose.Schema.Types.ObjectId, ref: "projects"}
})

export default mongoose.model(floorsCollection, floorsSchema)