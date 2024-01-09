import rentModel from "../models/rent.model.js"

class RentService {
  constructor(){}

  createRent = async (data) => {
    const result = await rentModel.create(data)
    return result
  }

  getRent = async (rid) => {
    const rent = await rentModel.findOne({_id: rid})
    return rent
  }

  getRentsFromApartment = async (aid) => {
    const rents = await rentModel.findOne({apartment: aid})
    return rents
  }
}

export default RentService