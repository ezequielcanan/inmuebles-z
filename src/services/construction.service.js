import constructionModel from "../models/construction.model.js"

class ConstructionService {
  constructor() {}

  createConstruction = async (construction) => {
    const result = await constructionModel.create(construction)
    return result
  }

  addBudget = async (cid, budget) => {
    const result = await constructionModel.findOneAndUpdate({_id: cid}, {$push: {budgets: budget}})
  }
}

export default ConstructionService