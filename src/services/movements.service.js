import moment from "moment"
import movementModel from "../models/movement.model.js"
import CheckService from "./check.service.js"
import TransferService from "./transfer.service.js"
import BillService from "./bill.service.js"
import WhitePaymentService from "./whitePayment.service.js"
import AccountService from "./account.service.js"
import mongoose, { Types } from "mongoose"


const checkService = new CheckService()
const transferService = new TransferService()
const billService = new BillService()
const whitePaymentService = new WhitePaymentService()
const accountService = new AccountService()

class MovementsService {
  constructor() { }

  createMovement = async (movement) => movementModel.create(movement)

  getAccountMovements = async (aid, filter = false, finished = true, emission = false) => {
    const account = await accountService.getAccountById(aid)
    const movements = await movementModel.find({ account: aid }).sort({ emissionDate: 1 }).lean().exec()
    const incomingChecks = movements?.filter(m => m?.incomingCheck)

    const checksAsMovements = incomingChecks.map(({_id, note, incomingCheck: check}) => {
      return {
        _id,
        credit: check.amount,
        emissionDate: check.emissionDate,
        date: check.operationDate,
        expirationDate: check.date,
        code: check.code,
        checkType: check.checkType,
        movementType: "Cheque",
        paid: check.state === "DEPOSITADO",
        error: check?.state === "RECHAZADO",
        state:
          check.state === "ACEPTADO"
            ? "PENDIENTE"
            : check.state === "DEPOSITADO"
            ? "REALIZADO"
            : check.state === "RECHAZADO"
            ? "ERROR"
            : check.state,
        detail: `${check?.owner?.name || check?.cashAccount?.name || check?.specialFrom} ${check.detail}`,
        incomingCheck: true,
        note
      }
    });


    const orderedByDateRows = [...movements?.filter(m => !m?.incomingCheck), ...checksAsMovements/*, ...transfers, ...checks, ...retentions*/].sort((a, b) => {
      if (filter) return new Date(a.expirationDate || a.emissionDate) - new Date(b.expirationDate || b.emissionDate)
      return new Date(emission ? (a.emissionDate || a.date) : (a.date || a.emissionDate)) - new Date(emission ? (b.emissionDate || b.date) : (b.date || b.emissionDate))
    })

    if (!finished) return orderedByDateRows.map((row) => {
      return {
        ...row,
        date: moment.utc(row?.date).format("DD-MM-YYYY"),
        emissionDate: moment.utc(row?.emissionDate).format("DD-MM-YYYY"),
        expirationDate: moment.utc(row?.expirationDate).format("DD-MM-YYYY")
      }
    })

    const rows = []
    orderedByDateRows.forEach((row, i) => {
      const tax = (row?.tax * row?.credit / 100) || 0
      const sixThousandths = (((row?.credit || 0) + (row?.debit || 0)) * 0.006) || 0
      rows.push({
        ...row,
        date: moment.utc(row?.date).format("DD-MM-YYYY"),
        emissionDate: moment.utc(row?.emissionDate).format("DD-MM-YYYY"),
        expirationDate: moment.utc(row?.expirationDate).format("DD-MM-YYYY"),
        tax,
        sixThousandths,
        balance: ((!i ? account?.initialBalance : rows[i - 1]?.balance) || 0) + (((moment(row?.expirationDate, "DD-MM-YYYY").isBefore(moment()) && !row?.paid && row?.movementType == "Cheque") || row?.error) ? 0 : (row?.credit || 0) - (row?.debit || 0) - tax - sixThousandths),
        realBalance: ((!i ? account?.initialBalance : rows[i - 1]?.realBalance) || 0) + ((!row?.paid && row?.movementType == "Cheque") ? 0 : (row?.credit || 0) - (row?.debit || 0) - tax - sixThousandths)
      })
    })

    return rows
  }

  getProjectChecks = async (pid, filter = false, finished = true, emission = false) => {
    const movements = await movementModel.aggregate([
      {
        $match: { movementType: "Cheque" } // Filtra por movementType
      },
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "accountDetails"
        }
      },
      {
        $unwind: "$accountDetails"
      },
      {
        $lookup: {
          from: "cashAccounts",
          localField: "cashAccount",
          foreignField: "_id",
          as: "cashAccountDetails"
        }
      },
      {
        $unwind: { path: "$cashAccountDetails", preserveNullAndEmptyArrays: true } // Permite campos nulos
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierDetails"
        }
      },
      {
        $unwind: { path: "$supplierDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceDetails"
        }
      },
      {
        $unwind: { path: "$serviceDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $match: { "accountDetails.society": new Types.ObjectId(pid) } // Filtra por project._id
      },
      {
        $project: {
          date: 1,
          emissionDate: 1,
          expirationDate: 1,
          code: 1,
          movementType: 1,
          paid: 1,
          detail: 1,
          credit: 1,
          debit: 1,
          tax: 1,
          state: 1,
          note: 1,
          lastCheck: 1,
          account: "$accountDetails",
          cashAccount: "$cashAccountDetails",
          supplier: "$supplierDetails",
          service: "$serviceDetails"
        }
      }
    ]);


    const orderedByDateRows = [...movements].sort((a, b) => {
      if (filter) return new Date(a.expirationDate) - new Date(b.expirationDate)
      return new Date(emission ? (a.emissionDate || a.date) : (a.date || a.emissionDate)) - new Date(emission ? (b.emissionDate || b.date) : (b.date || b.emissionDate))
    })

    return orderedByDateRows.map(row => {
      return {
        ...row, date: moment.utc(row?.date).format("DD-MM-YYYY"),
        emissionDate: moment.utc(row?.emissionDate).format("DD-MM-YYYY"),
        expirationDate: moment.utc(row?.expirationDate).format("DD-MM-YYYY"),
      }
    })
  }

  getExpiredChecks = async (aid) => {
    const movements = await this.getAccountMovements(aid)
    return movements.filter(movement => !movement.paid && movement.movementType == "Cheque" && moment(movement?.expirationDate, "DD-MM-YYYY").isBefore(moment()) && !movements.some(m => m?.lastCheck?.code == movement?.code))
  }

  updateMovement = async (mid, movement) => movementModel.updateOne({ _id: mid }, { $set: movement })

  deleteMovement = async (mid) => movementModel.deleteOne({ _id: mid })
  deleteMovementByIncomingCheck = async (cid) => movementModel.deleteOne({ incomingCheck: cid })

  getCashAccountMovements = async (cid) => movementModel.find({ cashAccount: cid })
  getSupplierMovements = async (sid) => movementModel.find({ supplier: sid })
  getServiceMovements = async (sid) => movementModel.find({ service: sid })

}

export default MovementsService