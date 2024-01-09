import ownerModel from "../models/owner.model.js"
import apartmentModel from "../models/apartment.model.js"

class OwnerService {
  constructor() { }

  createOwner = async (data) => {
    const result = await ownerModel.findOneAndUpdate({ name: data.name }, { $set: { ...data } }, { upsert: true })
    return result
  }

  getOwner = async (oid) => {
    const owner = await ownerModel.findById(oid)
    return owner
  }

  getOwnerApartments = async (oid) => {
    const apartments = await apartmentModel.find({ owner: oid })
    return apartments
  }

  updateOwner = async (oid, data) => {
    const result = await ownerModel.updateOne({ _id: oid }, { $set: { ...data } })
    return result
  }
}


export default OwnerService