import ServiceService from "../services/service.service.js"

const serviceService = new ServiceService()

export const createService = async (req, res) => {
  try {
    const result = await serviceService.createService(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getServices = async (req, res) => {
  try {
    const result = await serviceService.getServices()
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getServiceById = async (req, res) => {
  try {
    const result = await serviceService.getServiceById(req?.params?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateService = async (req, res) => {
  try {
    const result = await serviceService.updateService(req?.params?.sid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteService = async (req, res) => {
  try {
    const result = await serviceService.deleteService(req?.params?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}