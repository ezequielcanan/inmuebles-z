import moment from "moment"
import movementModel from "../models/movement.model.js"
import CheckService from "./check.service.js"
import TransferService from "./transfer.service.js"
import BillService from "./bill.service.js"
import WhitePaymentService from "./whitePayment.service.js"
import AccountService from "./account.service.js"


const checkService = new CheckService()
const transferService = new TransferService()
const billService = new BillService()
const whitePaymentService = new WhitePaymentService()
const accountService = new AccountService()

class MovementsService {
  constructor() { }

  createMovement = async (movement) => movementModel.create(movement)

  getAccountMovements = async (aid, filter = false, finished = true) => {
    const account = await accountService.getAccountById(aid)
    const movements = await movementModel.find({ account: aid }).sort({ emissionDate: 1 }).lean().exec()
    /*const transfers = (await transferService.getTransfersByAccount(aid))?.map((t) => {
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

    const bills = await billService.getBillsByRetentionAccount(aid)
    const whitePaymentsWithRetention = await whitePaymentService.getWhitePaymentsByRetentionAccount(aid)

    const retentions = []
    retentions.push(...bills?.map((b) => {
      return {
        emissionDate: b?.retention?.date,
        expirationDate: b?.retention?.expirationDate || b?.retention?.date,
        detail: b?.retention?.detail,
        credit: 0,
        tax: 0,
        canBeDeleted: false,
        debit: b?.retention?.amount,
        account: b?.retention?.account
      }
    }))

    retentions.push(...whitePaymentsWithRetention.map((p) => {
      return {
        emissionDate: p?.retention?.date,
        expirationDate: p?.retention?.expirationDate || p?.retention?.date,
        detail: p?.retention?.detail,
        credit: 0,
        tax: 0,
        canBeDeleted: false,
        debit: p?.retention?.amount,
        account: p?.retention?.account
      }
    }))*/


    const orderedByDateRows = [...movements/*, ...transfers, ...checks, ...retentions*/].sort((a, b) => {
      if (filter) return new Date(a.expirationDate) - new Date(b.expirationDate)
      return new Date(a.date || a.emissionDate) - new Date(b.date || b.emissionDate)
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
      const tax = row?.tax * row?.credit / 100
      const sixThousandths = (row?.credit + row?.debit) * 0.006
      rows.push({
        ...row,
        date: moment.utc(row?.date).format("DD-MM-YYYY"),
        emissionDate: moment.utc(row?.emissionDate).format("DD-MM-YYYY"),
        expirationDate: moment.utc(row?.expirationDate).format("DD-MM-YYYY"),
        tax,
        sixThousandths,
        balance: ((!i ? account?.initialBalance : rows[i - 1]?.balance) || 0) + ((moment(row?.expirationDate, "DD-MM-YYYY").isBefore(moment()) && !row?.paid) ? 0 : row?.credit - row?.debit - tax - sixThousandths),
        realBalance: ((!i ? account?.initialBalance : rows[i - 1]?.realBalance) || 0) + ((!row?.paid) ? 0 : row?.credit - row?.debit - tax - sixThousandths)
      })
    })

    return rows
  }

  getExpiredChecks = async (aid) => {
    const movements = await this.getAccountMovements(aid)
    return movements.filter(movement => !movement.paid && movement.movementType == "Cheque" && moment(movement?.expirationDate, "DD-MM-YYYY").isBefore(moment()) && !movements.some(m => m?.lastCheck?.code == movement?.code))
  }

  updateMovement = async (mid, movement) => movementModel.updateOne({ _id: mid }, { $set: movement })

  deleteMovement = async (mid) => movementModel.deleteOne({ _id: mid })

  getCashAccountMovements = async (cid) => movementModel.find({ cashAccount: cid })
  getSupplierMovements = async (sid) => movementModel.find({ supplier: sid })
  getServiceMovements = async (sid) => movementModel.find({ service: sid })

}

export default MovementsService