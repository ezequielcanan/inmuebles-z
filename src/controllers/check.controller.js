import CheckService from "../services/check.service.js"

const checkService = new CheckService()
export const createChecks = async (req, res) => {
  try {
    const result = await checkService.createChecks(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}