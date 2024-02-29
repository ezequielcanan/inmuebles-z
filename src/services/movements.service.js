import movementModel from "../models/movement.model.js"

class MovementsService {
  constructor() { }

  createMovement = async (movement) => movementModel.create(movement)

  getAccountMovements = async (aid) => movementModel.find({ account: aid })

  updateMovement = async (mid, movement) => movementModel.updateOne({ _id: mid }, { $set: movement })

  deleteMovement = async (mid) => movementModel.deleteOne({ _id: mid })
}

export default MovementsService