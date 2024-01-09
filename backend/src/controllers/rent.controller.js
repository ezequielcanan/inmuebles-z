import RentService from "../services/rent.service.js"

const rentService = new RentService()
export const createRent = async (req, res) => {
  try {
    const result = await rentService.createRent(req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}