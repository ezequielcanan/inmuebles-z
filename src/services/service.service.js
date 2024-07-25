import serviceModel from "../models/service.model.js";

class ServiceService {
  constructor() { }

  createService = data => serviceModel.create(data)
  getServices = () => serviceModel.find()
  getServiceById = id => serviceModel.find({ _id: id })
  updateService = (id, data) => serviceModel.updateOne({ _id: id }, { $set: data })
  deleteService = id => serviceModel.deleteOne({ _id: id })
}

export default ServiceService