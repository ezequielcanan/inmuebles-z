import { cashMovementsExcel, getExcelService, getProjectChecks, getSupplierOrServiceExcel } from "../excel/payments.js"
import MovementsService from "../services/movements.service.js"
import ProjectService from "../services/project.service.js"
import SupplierService from "../services/supplier.service.js"
import ServiceService from "../services/service.service.js"

const movementsService = new MovementsService()
const projectService = new ProjectService()
const supplierService = new SupplierService()
const serviceService = new ServiceService()

export const createMovement = async (req, res) => {
  try {
    const result = await movementsService.createMovement(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getAccountMovements = async (req, res) => {
  try {
    const result = await movementsService.getAccountMovements(req?.params?.aid, req?.query?.filter, true, false, req?.query?.page)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getServiceMovements = async (req, res) => {
  try {
    const result = await movementsService.getServiceMovements(req?.params?.sid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getMovement = async (req, res) => {
  try {
    const result = await movementsService.getMovement(req?.params?.mid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getProjectOutcomingChecks = async (req, res) => {
  try {
    const result = await movementsService.getProjectChecks(req?.params?.pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getSupplierExcel = async (req, res) => {
  try {
    let movements = await movementsService.getSupplierMovements(req?.params?.sid)
    movements = movements.sort((a, b) => new Date(a.date || a.emissionDate) - new Date(b.date || b.emissionDate)).filter(m => m?.account?.society?._id == req?.params?.pid)
    const project = await projectService.getProject(req?.params?.pid)
    const supplier = await supplierService.getSupplier(req?.params?.sid)

    const wb = getSupplierOrServiceExcel(supplier, project, movements)
    wb.write(`${supplier?.name} ${project?.title} BANCOS.xlsx`, res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getServiceExcel = async (req, res) => {
  try {
    let movements = (await movementsService.getServiceMovements(req?.params?.sid)).filter(m => !m?.notShows)
    movements = movements.sort((a, b) => new Date(a.date || a.emissionDate) - new Date(b.date || b.emissionDate))
    const service = await serviceService.getServiceById(req?.params?.sid)
    const wb = getExcelService(service, {}, movements, false, true)
    wb.write(`${service?.name} - ${service?.code} BANCOS.xlsx`, res)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateMovement = async (req, res) => {
  try {
    const result = await movementsService.updateMovement(req?.params?.mid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateMovementsTaxes = async (req, res) => {
  try {
    const result = await movementsService.updateMovementsTaxes(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const deleteMovement = async (req, res) => {
  try {
    const result = await movementsService.deleteMovement(req?.params?.mid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getExpiredChecks = async (req, res) => {
  try {
    const result = await movementsService.getExpiredChecks(req?.params?.aid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getChecksExcel = async (req, res) => {
  try {
    const society = await projectService.getProject(req?.params?.pid)
    const movements = await movementsService.getProjectChecks(req?.params?.pid, req?.query?.filter, true)

    const wb = getProjectChecks(movements, req?.query?.filter)
    wb.write(`Cheques ${society?.title}.xlsx`, res)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getCashExcel = async (req, res) => {
  try {
    const society = await projectService.getProject(req?.params?.pid)
    const movements = await movementsService.getCashMovements(req?.params?.pid, req?.query?.dollar)

    const wb = cashMovementsExcel(movements, req?.query?.dollar)
    wb.write(`Caja ${req?.query?.dollar ? "DOLARES " : "PESOS "}${society?.title}.xlsx`, res)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteMovementByIncomingCheck = async (req, res) => {
  try {
    const result = await movementsService.deleteMovementByIncomingCheck(req?.params?.cid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getCashMovements = async (req, res) => {
  try {
    const result = await movementsService.getCashMovements(req?.params?.pid, req?.query?.dollar)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}