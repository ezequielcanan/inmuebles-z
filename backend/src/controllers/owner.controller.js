import OwnerService from "../services/owner.service.js"

const ownerService = new OwnerService()
export const createOwner = async (req, res) => {
  try {
    const result = await ownerService.createOwner(req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}