import ApartmentService from "../services/apartment.service.js"
import __dirname from "../utils.js"
import fs from "fs"

const apartmentService = new ApartmentService()
export const getAllFromFloor = async (req, res) => {
  try {
    const apartments = await apartmentService.getAllFromFloor(req.params?.fid)
    res.sendSuccess(apartments)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getApartmentById = async (req, res) => {
  try {
    const apartment = await apartmentService.getApartmentById(req.params?.aid)
    res.sendSuccess(apartment)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const createApartment = async (req, res) => {
  try {
    const apartment = await apartmentService.createApartment({ ...req.body })
    res.sendSuccess(apartment)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateApartment = async (req, res) => {
  try {
    const result = await apartmentService.updateApartment(req.params?.aid, req.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getFiles = async (req, res) => {
  try {
    const project = req.query?.project
    const apartment = req.query?.apartment
    const fileType = req.params?.type || "photos"
    const files = apartmentService.getFiles(fileType, project, apartment)
    res.sendSuccess(files)
  }
  catch (e) {
    if (e.code == "ENOENT") return res.sendNotFoundError()
    console.log(e)
    res.sendServerError(e)
  }
}

export const deleteFile = async (req, res) => {
  try {
    const { project, apartment, fileType, file } = req.body
    fs.unlinkSync(`${__dirname}/public/projects/${project}/${apartment}/${fileType}/${file}`)

    const files = apartmentService.getFiles(fileType, project, apartment)
    res.sendSuccess(files)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}