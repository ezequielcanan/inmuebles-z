import mongoose from "mongoose"

const messagesCollection = "messages"

const messagesSchema = new mongoose.Schema({
  dateTime: Date,
  from: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
  to: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
  text: String,
  type: String,
  data: Object
})

export default mongoose.model(messagesCollection, messagesSchema)