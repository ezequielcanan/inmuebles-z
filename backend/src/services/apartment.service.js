import apartmentModel from "../models/apartment.model.js"

class ApartmentService {
  constructor() { }

  getAllFromProject = async (pid) => {
    const apartments = await apartmentModel.find({ project: pid })
    return apartments
  }

  getAllFromFloor = async (fid) => {
    const apartments = await apartmentModel.find({ floor: fid })
    return apartments
  }

  getApartmentById = async (aid) => {
    const apartment = await apartmentModel.findOne({ _id: aid })
    return apartment
  }

  createApartment = async (data) => {
    const apartment = await apartmentModel.create(data)
    return apartment
  }
}

export default ApartmentService