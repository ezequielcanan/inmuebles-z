import ApartmentService from "../services/apartment.service.js"

const apartmentService = new ApartmentService()
export const getAllFromFloor = async (req, res) => {
  try {
    const apartments = await apartmentService.getAllFromFloor(req.params?.fid)
    res.sendSuccess(apartments)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getApartmentById = async (req, res) => {
  try {
    const apartment = await apartmentService.getApartmentById(req.params?.aid)
    res.sendSuccess(apartment)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const createApartment = async (req, res) => {
  try {
    const apartment = await apartmentService.createApartment({ ...req.body })
    res.sendSuccess(apartment)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateApartment = async (req, res) => {
  try {
    const result = await apartmentService.updateApartment(req.params?.aid, req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}