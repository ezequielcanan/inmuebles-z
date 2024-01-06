import mongoose from "mongoose";

const transactionsCollection = "transactions";

const transactionsSchema = new mongoose.Schema({
  fastTransaction: Boolean,
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owners",
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owners",
  },
  boleto: {type: Boolean, default: this.fastTransaction ? false : true},
  booking: Number,
  sellados: {type: {
    boleto: {type: {
      necessary: Boolean,
      value: {type: Number, default: !this.necessary && 0},
      paid: Boolean
    }}
  }}
});

export default mongoose.model(transactionsCollection, transactionsSchema)