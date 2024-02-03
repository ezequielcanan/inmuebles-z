import budgetModel from "../models/budget.model.js"

class BudgetService {
  constructor() {}

  createBudget = async (budget) => {
    const result = await budgetModel.create(budget)
    return result
  }

  updateBudget = async (id, props) => {
    const result = await budgetModel.findOneAndUpdate({_id: id}, {$set: {...props}}, {new: true})
    return result
  }
}

export default BudgetService