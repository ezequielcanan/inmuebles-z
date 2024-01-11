import projectModel from "../models/project.model.js"

class ProjectService {
  constructor() { }

  createProject = async (project) => {
    const result = await projectModel.create(project)
    return result
  }

  updateProject = async (pid, update) => {
    const result = projectModel.findOneAndUpdate({ _id: pid }, update)
    return result
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

  getProject = async (pid) => {
    const result = await projectModel.findById(pid)
    return result
  }
}

export default ProjectService