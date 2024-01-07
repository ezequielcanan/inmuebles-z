import projectModel from "../models/project.model.js"

class ProjectService {
  constructor() { }

  createProject = async (project) => {
    const result = await projectModel.create(project)
    return result
  }

  updateProject = async (pid) => {
    const result = projectModel.updateOne({ _id: pid }, {})
  }

  getProjects = async () => {
    const result = await projectModel.find().lean()
    const categories = {
      status: true,
      "De pozo": result.filter(p => p.type == "De pozo"),
      "En desarrollo": result.filter(p => p.type == "En desarrollo"),
      "Finalizados": result.filter(p => p.type == "Finalizado")
    }
    return categories
  }
}

export default ProjectService