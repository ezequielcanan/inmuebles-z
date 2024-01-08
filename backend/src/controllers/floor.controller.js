import FloorService from "../services/floor.service.js"

const floorService = new FloorService()
export const createFloor = async (req, res) => {
  try {
    const data = { ...req.body, project: req.params?.pid }
    const result = await floorService.createFloor(data)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getProjectFloors = async (req, res) => {
  try {
    const data = await floorService.getProjectFloors(req.params?.pid)
    res.sendSuccess(data)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getFloor = async (req, res) => {
  try {
    const floor = await floorService.getFloor(req.params?.fid)
    res.sendSuccess(floor)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}