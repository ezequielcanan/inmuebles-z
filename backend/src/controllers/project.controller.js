import ApartmentService from "../services/apartment.service.js"
import ProjectService from "../services/project.service.js"

const apartmentService = new ApartmentService()
const projectService = new ProjectService()

export const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects()
    res.sendSuccess(projects)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getAllFromProject = async (req, res) => {
  try {
    const { pid } = req.params
    const apartments = await apartmentService.getAllFromProject(pid)
    res.sendSuccess(apartments)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const createProject = async (req, res) => {
  try {
    const data = req.body
    const result = await projectService.createProject(data)
    const thumbnailResult = await projectService.updateProject(result._id, { $set: { thumbnail: `projects/${result._id}/${result._id}${data.ext}` } })
    res.sendSuccess(thumbnailResult)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getProject = async (req, res) => {
  try {
    const result = await projectService.getProject(req.params?.pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}