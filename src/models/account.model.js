import mongoose from "mongoose"

const accountsCollection = "accounts"

const accountsSchema = new mongoose.Schema({
  cbu: String,
  bank: String,
  name: String,
  alias: String,
  cuit: String,
  initialBalance: Number,
  society: { type: mongoose.Schema.Types.ObjectId, ref: "projects" }
})

accountsSchema.pre("find", function () {
  this.populate("society")
})

accountsSchema.pre("findOne", function () {
  this.populate("society")
})

export default mongoose.model(accountsCollection, accountsSchema)