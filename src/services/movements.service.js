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

  getAccountMovements = async (aid, filter = "date", finished = true, emission = false, page) => {
    const account = await accountService.getAccountById(aid)
    const movements = await movementModel.find({ account: aid }).sort({ emissionDate: 1 }).lean().exec()
    const incomingChecks = movements?.filter(m => m?.incomingCheck)
    const rowsLimit = 30

    const checksAsMovements = incomingChecks.map(({ _id, tax, note, incomingCheck: check }) => {
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
        note,
        tax
      }
    });


    const orderedByDateRows = [...movements?.filter(m => {
      const isExpired = moment(m?.expirationDate).add(33, "days")?.isBefore(moment()) && m?.state == "PENDIENTE" && m?.movementType == "Cheque"
      return !m?.incomingCheck && !isExpired && !m?.notShows
    }), ...checksAsMovements/*, ...transfers, ...checks, ...retentions*/].sort((a, b) => {
      const dateA = a[filter] ? new Date(a[filter]) : null;
      const dateB = b[filter] ? new Date(b[filter]) : null;

      if (!dateA && !dateB) return 0; // Ambos no tienen la propiedad
      if (!dateA) return 1; // `a` no tiene la propiedad, va después
      if (!dateB) return -1; // `b` no tiene la propiedad, va después

      return dateA - dateB;
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
      const tax = !row?.error ? ((row?.tax * row?.credit / 100) || 0) : 0
      const sixThousandths = !row?.error ? ((((row?.credit || 0) + (row?.debit || 0) + (tax)) * 0.006) || 0) : 0

      const rowPush = {
        ...row,
        tax,
        sixThousandths,
        balance: ((!i ? account?.initialBalance : rows[i - 1]?.balance) || 0) + (((moment(row?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) && !row?.paid && row?.movementType == "Cheque") || row?.error) ? 0 : (row?.credit || 0) - (row?.debit || 0) - tax - sixThousandths),
        realBalance: ((!i ? account?.initialBalance : rows[i - 1]?.realBalance) || 0) + ((!row?.paid) ? 0 : (row?.credit || 0) - (row?.debit || 0) - tax - sixThousandths)
      }

      if (row?.date) rowPush["date"] = moment.utc(row?.date).format("DD-MM-YYYY")
      if (row?.emissionDate) rowPush["emissionDate"] = moment.utc(row?.emissionDate).format("DD-MM-YYYY")
      if (row?.expirationDate) rowPush["expirationDate"] = moment.utc(row?.expirationDate).format("DD-MM-YYYY")
      if (row?.error) {
        if (rowPush["debit"]) {
          rowPush["credit"] = rowPush["debit"]
        } else {
          rowPush["debit"] = rowPush["credit"]
        }
      }

      rows.push(rowPush)
    })

    if (page == 0 || page) {
      return rows?.reverse()?.slice(page * rowsLimit, rowsLimit * page + rowsLimit)?.reverse()
    }
    return rows
  }

  getMovement = async (mid) => movementModel.findOne({ _id: mid })

  getProjectChecks = async (pid, filter = "date", finished = true, emission = false) => {
    const movements = await movementModel.aggregate([
      {
        $match: { movementType: "Cheque", project: new Types.ObjectId(pid) } // Filtra por movementType
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
        $unwind: { path: "$accountDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: "cashaccounts",
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
        $project: {
          date: 1,
          emissionDate: 1,
          expirationDate: 1,
          code: 1,
          movementType: 1,
          paid: 1,
          error: 1,
          detail: 1,
          credit: 1,
          debit: 1,
          checkType: 1,
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
      const dateA = a[filter] ? new Date(a[filter]) : null;
      const dateB = b[filter] ? new Date(b[filter]) : null;

      if (!dateA && !dateB) return 0; // Ambos no tienen la propiedad
      if (!dateA) return 1; // `a` no tiene la propiedad, va después
      if (!dateB) return -1; // `b` no tiene la propiedad, va después

      return dateA - dateB;
    })

    return orderedByDateRows.map(row => {
      const returnRow = { ...row }
      if (row?.date) returnRow["date"] = moment.utc(row?.date).format("DD-MM-YYYY")
      if (row?.emissionDate) returnRow["emissionDate"] = moment.utc(row?.emissionDate).format("DD-MM-YYYY")
      if (row?.expirationDate) returnRow["expirationDate"] = moment.utc(row?.expirationDate).format("DD-MM-YYYY")

      return returnRow
    })
  }

  getExpiredChecks = async (aid) => {
    const movements = await this.getAccountMovements(aid)
    return movements.filter(movement => !movement.paid && movement.movementType == "Cheque" && moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) && !movements.some(m => m?.lastCheck?.code == movement?.code))
  }

  getCashMovements = (pid, dollar) => {
    const findObj = { project: pid, account: { $exists: false } }
    if (dollar) findObj["dollar"] = true
    else findObj["$or"] = [
      { dollar: { $exists: false } },
      { dollar: { $eq: false } },
      { dollar: null }
    ]

    return movementModel.find(findObj).sort({ date: "asc" })
  }

  updateMovement = async (mid, movement) => movementModel.updateOne({ _id: mid }, { $set: movement })
  updateMovementsTaxes = async (tax) => {
    const movements = await movementModel.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "account"
        }
      },
      { $unwind: { path: "$account", preserveNullAndEmptyArrays: true } },
      { $match: { "account.society": new Types.ObjectId(tax?.project), credit: { $gte: 1 } } },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, moment.utc(tax.month).month() + 1] },
              { $eq: [{ $year: "$date" }, moment.utc(tax.month).year()] }
            ]
          }
        }
      }
    ]);

    const movementIds = movements.map(m => m._id);

    await movementModel.updateMany(
      { _id: { $in: movementIds } },
      { $set: { tax: tax?.percentage } }
    );
  }

  deleteMovement = async (mid) => movementModel.deleteOne({ _id: mid })
  deleteMovementByIncomingCheck = async (cid) => movementModel.deleteOne({ incomingCheck: cid })

  getCashAccountMovements = async (cid) => movementModel.find({ cashAccount: cid })
  getSupplierMovements = async (sid) => movementModel.find({ supplier: sid })
  getServiceMovements = async (sid) => movementModel.find({ service: sid })

}

export default MovementsService