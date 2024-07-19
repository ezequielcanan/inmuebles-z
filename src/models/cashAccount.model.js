import mongoose from "mongoose"

const cashAccountsSchema = new mongoose.Schema({
  name: { type: String, unique: true }
})

const cashAccountModel = mongoose.model("cashAccounts", cashAccountsSchema)

export default cashAccountModel