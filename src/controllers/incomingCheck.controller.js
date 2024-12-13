import { incomingChecksExcel } from "../excel/payments.js"
import IncomingChecksService from "../services/incomingChecks.service.js"
import ProjectService from "../services/project.service.js"

const incomingCheckService = new IncomingChecksService()
const projectService = new ProjectService()

export const createIncomingCheck = async (req, res) => {
  try {
    const result = await incomingCheckService.createCheck(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getProjectChecks = async (req, res) => {
  try {
    const result = await incomingCheckService.getProjectChecks(req?.params?.pid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getIncomingCheck = async (req, res) => {
  try {
    const result = await incomingCheckService.getIncomingCheck(req?.params?.cid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateIncomingCheck = async (req, res) => {
  try {
    const result = await incomingCheckService.updateIncomingCheck(req?.params?.cid, req?.query?.property, req?.query?.value, req?.query?.action || "$set")
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const updateAllIncomingCheck = async (req, res) => {
  try {
    const result = await incomingCheckService.updateAllIncomingCheck(req?.params?.cid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const insertNewTransfer = async (req, res) => {
  try {
    const result = await incomingCheckService.insertNewTransfer(req?.params?.cid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const deleteTransfer = async (req, res) => {
  try {
    const result = await incomingCheckService.deleteTransfer(req?.params?.cid, req?.params?.tid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    res.sendServerError(e)
  }
}

export const getIncomingChecksExcel = async (req, res) => {
  try {
    const society = await projectService.getProject(req?.params?.pid)
    const checks = await incomingCheckService.getProjectChecks(req?.params?.pid)

    const wb = incomingChecksExcel(society, checks)
    wb.write(`Cheques recibidos ${society?.title}.xlsx`, res)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}