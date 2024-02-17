import mongoose from "mongoose"

const accountsCollection = "accounts"

const accountsSchema = new mongoose.Schema({
  cbu: String,
  bank: String,
  name: String,
  alias: String,
  cuit: String,
  society: String
})

export default mongoose.model(accountsCollection, accountsSchema)