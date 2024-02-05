import BudgetService from "../services/budget.service.js"


const budgetService = new BudgetService()

export const createBudget = async (req, res) => {
  try {
    const result = await budgetService.createBudget(req?.body)
    res.sendSuccess(result)
  }
  catch (e) {
    req.logger.error(e)
    res.sendServerError(e)
  }
}

export const getBudgets = async (req, res) => {
  try {
    const result = await budgetService.getBudgets()
    res.sendSuccess(result)
  }
  catch (e) {
    req.logger.error(e)
    res.sendServerError(e)
  }
}

export const getBudgetFiles = (req, res) => {
  try {
    const result = budgetService.getFiles(req?.params?.pid, req?.params?.bid)
    res.sendSuccess(result)
  }
  catch (e) {
    req.logger.error(e, "asdasd")
    res.sendServerError(e)
  }
}
