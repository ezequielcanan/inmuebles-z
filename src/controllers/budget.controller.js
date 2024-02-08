import BudgetService from "../services/budget.service.js"


const budgetService = new BudgetService()

export const createBudget = async (req, res) => {
  try {
    const result = await budgetService.createBudget(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getBudgets = async (req, res) => {
  try {
    const result = await budgetService.getBudgets()
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const getBudget = async (req, res) => {
  try {
    const result = await budgetService.getBudget(req?.params?.bid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.log(e)
    console.error(e)
    res.sendServerError(e)
  }
}

export const getBudgetFiles = (req, res) => {
  try {
    const result = budgetService.getFiles(req?.params?.pid, req?.params?.bid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateBudget = async (req, res) => {
  try {
    const result = await budgetService.updateBudget(req?.params?.bid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const addNote = async (req, res) => {
  try {
    const result = await budgetService.addNote(req?.params?.bid, req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const updateNote = async (req, res) => {
  try {
    const result = await budgetService.updateNote(req?.params?.bid, req?.params?.nid, req?.body?.note)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}

export const deleteNote = async (req, res) => {
  try {
    const result = await budgetService.deleteNote(req?.params?.bid, req?.params?.nid)
    res.sendSuccess(result)
  }
  catch (e) {
    console.error(e)
    res.sendServerError(e)
  }
}