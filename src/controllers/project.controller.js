import ApartmentService from "../services/apartment.service.js"
import ProjectService from "../services/project.service.js"
import FloorService from "../services/floor.service.js"
import TransactionService from "../services/transaction.service.js"
import BudgetService from "../services/budget.service.js"
import SupplierService from "../services/supplier.service.js"
import PaymentService from "../services/payment.service.js"
import BillService from "../services/bill.service.js"
import { createProjectExcel } from "../excel/index.js"
import { projectSupplierExcel } from "../excel/payments.js"

const apartmentService = new ApartmentService()
const projectService = new ProjectService()
const floorService = new FloorService()
const transactionService = new TransactionService()
const budgetService = new BudgetService()
const supplierService = new SupplierService()
const paymentService = new PaymentService()
const billService = new BillService()

export const getProjects = async (req, res) => {
  try {
    req.query.filter = req?.query?.filter != "false"
    const projects = await projectService.getProjects(req?.query?.filter)
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

export const getProjectSupplierExcel = async (req, res) => {
  try {
    const { sid, pid } = req?.params
    const project = await projectService.getProject(pid)
    const supplier = await supplierService.getSupplier(sid)
    const budgets = await budgetService.getBudgetsByProject(pid, sid)
    const bills = await billService.getBillsByProjectAndSupplier(pid, sid)
    const payments = []

    await Promise.all(budgets?.map(async (budget) => {
      const budgetPayments = await paymentService.getBudgetPayments(budget?._id)
      payments?.push(...budgetPayments)
    }))


    const wb = projectSupplierExcel(project, supplier, payments, bills)
    wb.write(`Cuenta corriente general ${project?.title} - ${supplier?.name || ""}.xlsx`, res)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}