import ApartmentService from "../services/apartment.service.js"
import ProjectService from "../services/project.service.js"

const apartmentService = new ApartmentService()
const projectService = new ProjectService()

export const getAllFromProject = async (req,res) => {
  try {
    const {pid} = req.params
    const apartments = await apartmentService.getAllFromProject(pid)
    res.json({status: "success", payload: apartments})
  }
  catch(e) {
    console.log(e)
    res.status(500).json({status: "error", payload: "Server error"})
  }
}

export const createProject = async (req,res) => {
  try {
    const data = req.body
    const result = await projectService.createProject(data)
    res.json({status: "success", payload: result})
  }
  catch(e) {
    console.log(e)
    res.status(500).json({status: "error", payload: "Server error"})
  }
}