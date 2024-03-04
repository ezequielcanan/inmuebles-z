import mongoose from "mongoose"

const messagesCollection = "messages"

const messagesSchema = new mongoose.Schema({
  dateTime: Date,
  from: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  title: String,
  text: String,
  type: String,
  data: Object,
})

messagesSchema.pre("find", function () {
  this.populate("from")
  this.populate("to")
})

export default mongoose.model(messagesCollection, messagesSchema)