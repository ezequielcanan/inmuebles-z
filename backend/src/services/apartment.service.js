import apartmentModel from "../models/apartment.model.js"

class ApartmentService {
  constructor() {}

  getAllFromProject = async (pid) => {
    const apartments = await apartmentModel.find({project: pid})
    return apartments
  } 
}

export default ApartmentService