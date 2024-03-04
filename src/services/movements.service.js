import movementModel from "../models/movement.model.js"
import CheckService from "./check.service.js"
import TransferService from "./transfer.service.js"

const checkService = new CheckService()
const transferService = new TransferService()

class MovementsService {
  constructor() { }

  createMovement = async (movement) => movementModel.create(movement)

  getAccountMovements = async (aid, filter = false) => {
    const movements = await movementModel.find({ account: aid }).sort({ emissionDate: 1 })
    const transfers = (await transferService.getTransfersByAccount(aid))?.map((t) => {
      return {
        emissionDate: t?.emissionDate,
        expirationDate: t?.emissionDate,
        detail: t?.detail,
        credit: 0,
        tax: 0,
        canBeDeleted: false,
        debit: t?.amount,
        account: t?.account
      }
    })
    const checks = (await checkService.getChecksByAccount(aid))?.map((c) => {
      return {
        emissionDate: c?.emissionDate,
        expirationDate: c?.expirationDate,
        checkCode: c?.code,
        detail: c?.detail,
        credit: 0,
        tax: 0,
        canBeDeleted: false,
        debit: c?.amount,
        account: c?.account
      }
    })

    return [...movements, ...transfers, ...checks].sort((a, b) => {
      if (filter) return new Date(a.expirationDate) - new Date(b.expirationDate)
      return new Date(a.emissionDate) - new Date(b.emissionDate)
    })

  }

  updateMovement = async (mid, movement) => movementModel.updateOne({ _id: mid }, { $set: movement })

  deleteMovement = async (mid) => movementModel.deleteOne({ _id: mid })
}

export default MovementsService