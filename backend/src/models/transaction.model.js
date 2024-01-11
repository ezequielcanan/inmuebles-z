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
  boleto: Boolean,
  booking: Number,
  sellados: {
    type: {
      boleto: {
        type: {
          necessary: Boolean,
          value: Number,
          paid: Boolean
        }
      }
    }
  }
});

transactionsSchema.pre("find", function () {
  this.populate("seller")
  this.populate("buyer")
})

export default mongoose.model(transactionsCollection, transactionsSchema)