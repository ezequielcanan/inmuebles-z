import ApartmentService from "../services/apartment.service.js"
import ProjectService from "../services/project.service.js"
import FloorService from "../services/floor.service.js"
import TransactionService from "../services/transaction.service.js"
import { createProjectExcel } from "../excel/index.js"

const apartmentService = new ApartmentService()
const projectService = new ProjectService()
const floorService = new FloorService()
const transactionService = new TransactionService()

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

export const getApartmentsByRooms = async (req, res) => {
  try {
    const { pid, rooms } = req.params
    const result = await apartmentService.getProjectApartmentsByRooms(pid, rooms)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getProjectTotalMeters = async (req, res) => {
  try {
    const { pid } = req.params
    const result = await apartmentService.getProjectTotalMeters(pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getProjectTotalUnits = async (req, res) => {
  try {
    const { pid } = req.params
    const result = await apartmentService.getProjectTotalUnits(pid)
    res.sendSuccess(result)
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

export const createExcelProject = async (req, res) => {
  try {
    const floors = await floorService.getProjectFloors(req?.params?.pid)
    const floorsApartments = await Promise.all(floors.map(async (floor, i) => {
      const apartments = await apartmentService.getAllFromFloor(floor._id)
      return { ...floor, apartments }
    }))
    const transactions = await transactionService.getProjectTransactions(req?.params?.pid)

    const wb = createProjectExcel(floorsApartments, floors[0].project, transactions)
    wb.write(`General ${floors[0]?.project?.title || ""}.xlsx`, res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}