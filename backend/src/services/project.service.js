import projectModel from "../models/project.model.js"

class ProjectService {
  constructor(){}

  createProject = async (project) => {
    const result = await projectModel.create(project)
    return result
  }

}

export default ProjectService