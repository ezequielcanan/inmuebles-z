import floorModel from "../models/floor.model.js"

class FloorService {
  constructor() { }

  createFloor = async (data) => {
    const result = floorModel.create(data)
    return result
  }
}

export default FloorService