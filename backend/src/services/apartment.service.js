import apartmentModel from "../models/apartment.model.js"
import fs from "fs"
import __dirname from "../utils.js"

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

  updateApartment = async (aid, data) => {
    const result = await apartmentModel.findOneAndUpdate({ _id: aid }, { ...data })
    return result
  }

  getFiles = (fileType, project, apartment) => {
    const files = []
    fs.readdirSync(__dirname + "/public/projects/" + project + "/" + apartment + "/" + fileType).forEach(file => files.push(file))
    return files
  }

  getApartmentsByOwner = async (oid) => {
    const result = await apartmentModel.find({ owner: oid }).lean().exec()
    return result
  }
}

export default ApartmentService