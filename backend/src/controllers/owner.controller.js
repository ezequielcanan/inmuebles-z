import OwnerService from "../services/owner.service.js"
import ApartmentService from "../services/apartment.service.js"

const ownerService = new OwnerService()
const apartmentService = new ApartmentService()

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

export const ownerTextSearch = async (req, res) => {
  try {
    const result = await ownerService.textSearch(req.query?.query)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getOwnerApartments = async (req, res) => {
  try {
    const result = await apartmentService.getApartmentsByOwner(req.params?.oid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}