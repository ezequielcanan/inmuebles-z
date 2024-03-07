import mongoose from "mongoose"

const usersCollection = "users"

const usersSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  role: { type: String, enum: ["admin", "secretary", "user", "bank", "executive", "unknow"], default: "user" },
  projects: {
    type: [{
      project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
      action: { type: String, enum: ["edit", "view"] }
    }]
  },
  notifications: [
    {
      role: { type: String, enum: ["incomes", "expenses", "both"] },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
    }
  ]
})

export default mongoose.model(usersCollection, usersSchema)