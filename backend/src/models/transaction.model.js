import mongoose from "mongoose";

const transactionsCollection = "transactions";

const transactionsSchema = new mongoose.Schema({
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: "apartments" },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owners",
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owners",
  },
  booking: Number,
  black: {
    type: {
      quotas: Number,
      baseQuota: Number,
      updatedQuota: Number,
      lastQuota: {type: mongoose.Schema.Types.ObjectId, ref: "quotas"}
    }
  },
  white: {
    type: {
      quotas: Number,
      baseQuota: Number,
      updatedQuota: Number,
      lastQuota: {type: mongoose.Schema.Types.ObjectId, ref: "quotas"}
    }
  }
});

transactionsSchema.pre("find", function () {
  this.populate("seller")
  this.populate("buyer")
})

transactionsSchema.pre("findOne", function () {
  this.populate("seller")
  this.populate("buyer")
  this.populate("apartment")
})

export default mongoose.model(transactionsCollection, transactionsSchema)