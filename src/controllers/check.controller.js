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

export const getFiles = (req, res) => {
  try {
    const result = checkService.getFiles(req?.body?.thumbnail)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteCheck = async (req, res) => {
  try {
    const result = await checkService.deleteCheck(req?.body?.payment, req?.body?.check, req?.body?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateChecks = async (req, res) => {
  try {
    const result = await checkService.updateChecks(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}