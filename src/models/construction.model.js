import mongoose from "mongoose"

const constructionsCollection = "constructions"

const constructionsSchema = new mongoose.Schema({
  project: {type: mongoose.Schema.Types.ObjectId, ref: "projects"},
  budgets: [
    {type: mongoose.Schema.Types.ObjectId, ref: "budgets"}
  ]
})