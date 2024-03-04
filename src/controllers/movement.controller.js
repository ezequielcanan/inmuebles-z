import MovementsService from "../services/movements.service.js"


const movementsService = new MovementsService()

export const createMovement = async (req, res) => {
  try {
    const result = await movementsService.createMovement(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getAccountMovements = async (req, res) => {
  try {
    const result = await movementsService.getAccountMovements(req?.params?.aid, (req?.query?.filter == "true" ? true : false))
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateMovement = async (req, res) => {
  try {
    const result = await movementsService.updateMovement(req?.params?.mid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const deleteMovement = async (req, res) => {
  try {
    const result = await movementsService.deleteMovement(req?.params?.mid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}