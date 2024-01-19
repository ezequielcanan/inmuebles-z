import rentModel from "../models/rent.model.js"

class RentService {
  constructor() { }

  createRent = async (data) => {
    const filter = {}
    data._id && (filter._id = data._id)
    let result = await rentModel.findOneAndUpdate(filter, { ...data }, { upsert: true })
    result == null && (result = await rentModel.findOne({ apartment: data?.apartment }))
    return result
  }

  getRent = async (rid) => {
    const rent = await rentModel.findOne({ _id: rid })
    return rent
  }

  getRentsFromApartment = async (aid) => {
    const rents = await rentModel.findOne({ apartment: aid })
    return rents
  }

  deleteRent = async (rid) => {
    const result = await rentModel.deleteOne({ _id: rid })
    return result
  }
}

export default RentService