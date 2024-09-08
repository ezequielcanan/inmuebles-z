import mongoose from "mongoose";

const budgetsCollection = "budgets";

const budgetsSchema = new mongoose.Schema({
  total: Number,
  title: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "suppliers" },
  percentage: Number,
  paymentType: { type: String, enum: ["quotas", "advance"] },
  quotas: Number,
  baseIndex: Number,
  advanced: Number,
  booking: Number,
  bookingType: { type: String, enum: ["total", "quotas"] },
  bookingPercentage: Number,
  code: String,
  date: Date,
  dollarPrice: Number,
  active: { type: Boolean, default: true },
  notes: {
    type: [
      {
        date: Date,
        note: String
      }
    ],
    default: []
  },
  lastPayment: { type: mongoose.Schema.Types.ObjectId, ref: "payments" },
  paidApartments: {
    type: [
      {
        apartment: { type: mongoose.Schema.Types.ObjectId, ref: "transactions" },
        percentage: Number,
        discount: { type: String, enum: ["quota", "total"] }
      }
    ],
    default: []
  }
});

budgetsSchema.pre("find", function () {
  this.populate("project")
  this.populate("supplier")
  this.populate("lastPayment")
  this.populate("paidApartments.apartment")
})


budgetsSchema.pre("findOne", function () {
  this.populate("project")
  this.populate("supplier")
  this.populate("lastPayment")
  this.populate("paidApartments.apartment")
})

budgetsSchema.pre("findOneAndUpdate", function () {
  this.populate("project")
  this.populate("supplier")
  this.populate("lastPayment")
  this.populate("paidApartments.apartment")
})

budgetsSchema.pre("findOneAndDelete", function () {
  this.populate("supplier")
  this.populate("lastPayment")
  this.populate("paidApartments.apartment")
})

export default mongoose.model(budgetsCollection, budgetsSchema);
