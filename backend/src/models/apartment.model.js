import mongoose from "mongoose";

const apartmentsCollection = "apartments";

const apartmentsSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  floor: { type: mongoose.Schema.Types.ObjectId, ref: "floors" },
  unit: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "owners" },
  forSale: Boolean,
  meters: {
    type: {
      covered: Number,
      uncovered: { type: Number, default: 0 },
      balcony: Number,
      amenities: Number,
      total: {
        type: Number, default: () => {
          console.log(this)
          return this.covered + this.uncovered + this.balcony + this.amenities
        }
      }
    },
  },
  rooms: Number,
  rent: { type: mongoose.Schema.Types.ObjectId, ref: "rents" },
  orientation: { type: String, enum: ["Frente", "Contrafrente", "Izquierda", "Derecha"] }
});

apartmentsSchema.pre("findOne", function () {
  this.populate("project")
  this.populate("floor")
  this.populate("owner")
  this.populate("rent")
})

export default mongoose.model(apartmentsCollection, apartmentsSchema)