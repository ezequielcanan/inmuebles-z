import mongoose from "mongoose";

const budgetsCollection = "budgets";

const budgetsSchema = new mongoose.Schema({
  total: Number,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
  percentage: Number,
  paymentType: { type: String, enum: ["quotas", "advance"] },
  baseIndex: Number,
  advanced: Number,
  booking: Number,
  code: String,
  date: Date,
  dollarPrice: Number,
  paidApartments: {
    type: [
      {
        apartment: { type: mongoose.Schema.Types.ObjectId, ref: "transactions" },
        discount: { type: String, enum: ["quota", "total"] }
      }
    ],
    default: []
  }
});

budgetsSchema.pre("find", function () {
  this.populate("project")
  this.populate("supplier")
})

export default mongoose.model(budgetsCollection, budgetsSchema);
