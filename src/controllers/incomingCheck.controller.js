import IncomingChecksService from "../services/incomingChecks.service.js"

const incomingCheckService = new IncomingChecksService()

export const createIncomingCheck = async (req, res) => {
  try {
    const result = await incomingCheckService.createCheck(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}