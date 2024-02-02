import ownerModel from "../models/owner.model.js"
import apartmentModel from "../models/apartment.model.js"

class OwnerService {
  constructor() { }

  createOwner = async (data) => {
    let result = await ownerModel.findOneAndUpdate({ name: data.name }, { $set: { ...data } }, { upsert: true })
    result == null && (result = await ownerModel.findOne({ name: data?.name }))
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

  textSearch = async (text) => {
    const result = await ownerModel.find({ $text: { $search: text, $caseSensitive: false } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } })
    return result
  }
}


export default OwnerService