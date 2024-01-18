import floorModel from "../models/floor.model.js"

class FloorService {
  constructor() { }

  createFloor = async (data) => {
    const lastIndex = await floorModel.find({ project: data.project }).sort({ index: -1 }).limit(1).lean().exec()
    data.index = lastIndex.length ? lastIndex[0].index + 1 : 0
    data.title = data.index ? `Piso ${data.index}` : "Planta Baja"
    const result = await floorModel.create(data)
    return result
  }

  getProjectFloors = async (pid) => {
    const result = await floorModel.find({ project: pid }).lean().exec()
    return result
  }

  getFloor = async (fid) => {
    const floor = await floorModel.findOne({ _id: fid }).lean().exec()
    return floor
  }
}

export default FloorService