import apartmentModel from "../models/apartment.model.js"
import fs from "fs"
import __dirname from "../utils.js"
import mongoose from "mongoose"

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

  getProjectApartmentsByRooms = async (pid, rooms) => {
    const result = await apartmentModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(pid),
          rooms
        }
      },
      {
        $facet: {
          vendidos: [
            { $match: { forSale: false } },
            {
              $group: { _id: null, count: { "$sum": 1 } }
            },
          ],
          disponibles: [
            { $match: { forSale: true } },
            {
              $group: { _id: null, count: { "$sum": 1 } }
            },
          ],
        }
      }
    ])

    return result
  }

  getProjectTotalMeters = async (pid) => {
    const result = await apartmentModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(pid),
        }
      },
      {
        $facet: {
          vendidos: [
            { $match: { forSale: false } },
            {
              $group: { _id: null, count: { "$sum": "$meters.total" } }
            },
          ],
          disponibles: [
            { $match: { forSale: true } },
            {
              $group: { _id: null, count: { "$sum": "$meters.total" } }
            },
          ],
        }
      }
    ])

    return result
  }

  getProjectTotalUnits = async (pid) => {
    const result = await apartmentModel.aggregate([
      {
        $match: {
          project: new mongoose.Types.ObjectId(pid),
        }
      },
      {
        $facet: {
          vendidos: [
            { $match: { forSale: false } },
            {
              $group: { _id: null, count: { "$sum": 1 } }
            },
          ],
          disponibles: [
            { $match: { forSale: true } },
            {
              $group: { _id: null, count: { "$sum": 1 } }
            },
          ],
        }
      }
    ])

    return result
  }
}

export default ApartmentService