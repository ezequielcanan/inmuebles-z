import serviceModel from "../models/service.model.js";

class ServiceService {
  constructor() { }

  createService = data => serviceModel.create(data)
  getServices = async () => {
    const condObj = { $eq: ["$$movement.service", "$_id"] }
    const result = await serviceModel.aggregate([
      {
        $lookup: {
          from: "movements",
          let: { service: "service" },
          pipeline: [
          ],
          as: "movements"
        }
      },
      {
        $project: {
          name: 1,
          code: 1,
          movements: {
            $size: {
              $filter: {
                input: "$movements",
                as: "movement",
                cond: condObj
              }
            }
          }
        }
      },
      {
        $sort: {name: 1}
      }
    ])

    return result
  }
  getServiceById = id => serviceModel.find({ _id: id })
  updateService = (id, data) => serviceModel.updateOne({ _id: id }, { $set: data })
  deleteService = id => serviceModel.deleteOne({ _id: id })
}

export default ServiceService