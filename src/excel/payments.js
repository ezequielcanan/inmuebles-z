import xl from "excel4node"
import { textCenterStyle, thinBorder, boldBorder, bgHead, bgSectionInfo, fontHeadStyle, bgSectionHead } from "./index.js"
import moment from "moment"

moment.locale('es')

export const paymentExcel = (payment, lastPayment) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet("CERTIFICADO", {
    sheetFormat: {
      'defaultColWidth': 20,
      'defaultRowHeight': 30,
    }
  })

  const wsBills = wb.addWorksheet("FACTURAS", {
    sheetFormat: {
      'defaultColWidth': 20,
      'defaultRowHeight': 30,
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      font: {
        size: 14,
        bold: true,
        color: "#FFFFFF"
      },
      ...textCenterStyle,
      ...boldBorder,
      ...bgSectionHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -'
    })
  }

  const apartmentsWhitePercentageOfBudget = payment?.budget?.paidApartments?.reduce((acc, apartment, i) => {
    if (apartment?.discount == "quota") {
      return acc + ((apartment?.apartment?.total * apartment?.apartment?.dolar) * apartment?.percentage / 100)
    } else return acc
  }, 0) / (payment?.budget?.percentage * payment?.budget?.total / 100)

  const apartmentsBlackPercentageOfBudget = payment?.budget?.paidApartments?.reduce((acc, apartment, i) => {
    if (apartment?.discount == "quota") {
      return acc + ((apartment?.apartment?.total * apartment?.apartment?.dolar) * (100 - apartment?.percentage) / 100)
    } else return acc
  }, 0) / ((100 - payment?.budget?.percentage) * payment?.budget?.total / 100)

  const bookingWhitePercentageOfBudget = payment?.budget?.bookingType == "quotas" ? ((payment?.budget?.bookingPercentage * payment?.budget?.booking / 100) / (payment?.budget?.percentage * payment?.budget?.total / 100)) : 0


  const bookingBlackPercentageOfBudget = payment?.budget?.bookingType == "quotas" ? (((100 - payment?.budget?.bookingPercentage) * payment?.budget?.booking / 100) / ((100 - payment?.budget?.percentage) * payment?.budget?.total / 100)) : 0


  ws.cell(1, 1).string("Total").style(styles["sectionHead"])
  ws.cell(1, 2).number(payment?.amount).style(styles["importantCell"])

  /*ws.cell(1, 4).string("Total unidades").style(styles["sectionHead"])
  ws.cell(1, 5).number(payment?.discountByApartments).style(styles["importantCell"])*/

  ws.cell(3, 4, 3, 5, true).string("Actualizacion").style(styles["importantCell"])
  ws.cell(4, 4).string("Indice base").style(styles["importantCell"])
  ws.cell(4, 5).number(payment?.budget?.baseIndex).style(styles["importantCell"])
  ws.cell(5, 4).string("Indice actual").style(styles["importantCell"])
  ws.cell(5, 5).number(payment?.indexCac).style(styles["importantCell"])
  ws.cell(6, 4).string("Aumento").style(styles["importantCell"])
  ws.cell(6, 5).formula(`E5 / E4 - 1`).style(styles["importantCell"])

  const subtotalRow = 4
  const subtotalWithBookingRow = 5
  const mayorCostoRow = 6
  const mayorCostoDefRow = 7
  const brutoRow = 8
  const ivaRow = 9
  const taxesRow = 10
  const payRow = 11
  const incomeSubtotalRow = 13
  const incomeMayorCostoRow = 14
  const incomeMayorCostoDefRow = 15
  const incomeTotalRow = 16
  const incomeTotalFinishedRow = 17
  const balanceRow = 21

  const writeSectionImportantCells = (type = "A", col = 7) => {
    ws.cell(3, col, 3, col + 1, true).string(type).style(styles["sectionHead"])
    ws.cell(subtotalRow, col).string("Subtotal").style(styles["importantCell"])
    ws.cell(subtotalWithBookingRow, col).string("Subtotal con anticipo").style(styles["importantCell"])
    ws.cell(mayorCostoRow, col).string("Mayor costo").style(styles["cell"])
    ws.cell(mayorCostoDefRow, col).string("Mayor costo definitivo").style(styles["cell"])
    ws.cell(brutoRow, col).string("Total").style(styles["cell"])
    type == "A" && ws.cell(ivaRow, col).string("IVA:").style(styles["cell"])
    type == "A" && ws.cell(taxesRow, col).string("Impuestos:").style(styles["cell"])
    ws.cell(payRow, col).string("Total a pagar:").style(styles["header"])
    ws.cell(incomeSubtotalRow, col).string("A cobrar unidades:").style(styles["importantCell"])
    ws.cell(incomeMayorCostoRow, col).string("Mayor costo").style(styles["cell"])
    ws.cell(incomeMayorCostoDefRow, col).string("Mayor costo definitivo").style(styles["cell"])
    ws.cell(incomeTotalRow, col).string("Total:").style(styles["cell"])
    ws.cell(incomeTotalFinishedRow, col).string("Total a cobrar:").style(styles["header"])
    ws.cell(balanceRow, col).string("SALDO A PAGAR").style(styles["importantCell"])
  }

  const adjustmentCell = "E6"

  const writeSectionInfo = (percentage, apartmentsPercentage, bookingPercentage, type = "white", col = 8) => {

    const lastMcpApartments = (lastPayment?.discountByApartments * percentage / 100) * (lastPayment?.indexCac / payment?.budget?.baseIndex - 1)
    const lastMcdApartments = (lastPayment?.discountByApartments * percentage / 100) * (payment?.indexCac / payment?.budget?.baseIndex - 1)

    const lastMcp = lastPayment ? lastPayment[type]?.mcp : 0
    const lastMcd = lastPayment ? lastPayment[type]?.mcd : 0

    const conceptBill = payment?.white?.bills?.find(b => b.concept == "certificate")?.bill
    ws.cell(subtotalRow, col).formula(`B1 * ${percentage}%`).style(styles["cell"])
    ws.cell(subtotalWithBookingRow, col + 1).formula(`${bookingPercentage} * 100`).style(styles["cell"])
    ws.cell(subtotalWithBookingRow, col).formula(`${xl.getExcelCellRef(subtotalRow, col)} - (${xl.getExcelCellRef(subtotalRow, col)} * ${xl.getExcelCellRef(subtotalWithBookingRow, col + 1)}%)`).style(styles["cell"])
    ws.cell(mayorCostoRow, col).formula(`${xl.getExcelCellRef(subtotalWithBookingRow, col)} * ${adjustmentCell}`).style(styles["cell"])
    ws.cell(mayorCostoDefRow, col).number((lastMcd - lastMcp) || 0).style(styles["cell"])
    ws.cell(brutoRow, col).formula(`SUM(${xl.getExcelCellRef(subtotalWithBookingRow, col)}:${xl.getExcelCellRef(mayorCostoDefRow, col)})`).style(styles["cell"])
    type == "white" && ws.cell(ivaRow, col).formula(`${xl.getExcelCellRef(brutoRow, col)} * ${(conceptBill?.iva || 0)}% `).style(styles["cell"])
    type == "white" && ws.cell(taxesRow, col).formula(`${xl.getExcelCellRef(brutoRow, col)} * ${(conceptBill?.taxes || 0)}% `).style(styles["cell"])
    ws.cell(payRow, col).formula(`SUM(${xl.getExcelCellRef(brutoRow, col)}: ${xl.getExcelCellRef(taxesRow, col)})`).style(styles["cell"])
    ws.cell(incomeSubtotalRow, col + 1).formula(`${apartmentsPercentage} * 100`).style(styles["cell"])
    ws.cell(incomeSubtotalRow, col).formula(`${xl.getExcelCellRef(incomeSubtotalRow, col + 1)}% * ${xl.getExcelCellRef(subtotalRow, col)}`).style(styles["cell"])
    ws.cell(incomeMayorCostoRow, col).formula(`${xl.getExcelCellRef(incomeSubtotalRow, col)} * ${adjustmentCell} `).style(styles["cell"])
    ws.cell(incomeMayorCostoDefRow, col).number(0).style(styles["cell"])
    ws.cell(incomeTotalRow, col).formula(`SUM(${xl.getExcelCellRef(incomeSubtotalRow, col)}: ${xl.getExcelCellRef(incomeMayorCostoDefRow, col)})`).style(styles["cell"])
    ws.cell(incomeTotalFinishedRow, col).formula(`${xl.getExcelCellRef(incomeTotalRow, col)}`).style(styles["cell"])
    ws.cell(balanceRow, col).formula(`${xl.getExcelCellRef(payRow, col)} - ${xl.getExcelCellRef(incomeTotalFinishedRow, col)}`).style(styles["sectionHead"])
    ws.column(col).setWidth(35)
  }

  writeSectionImportantCells("A")
  writeSectionImportantCells("B", 1)
  writeSectionInfo(payment?.budget?.percentage, apartmentsWhitePercentageOfBudget, bookingWhitePercentageOfBudget)
  writeSectionInfo((100 - payment?.budget?.percentage), apartmentsBlackPercentageOfBudget, bookingBlackPercentageOfBudget, "black", 2)

  const writeBillInfo = (bill, concept, col = 1) => {
    wsBills.cell(3, col).string(bill?.code).style(styles["header"])
    wsBills.cell(3, col + 1).string(concept).style(styles["header"])
    wsBills.cell(4, col).string(`IVA ${bill?.iva}%`).style(styles["cell"])
    wsBills.cell(5, col).number(bill?.amount).style(styles["cell"])
    wsBills.cell(6, col).formula(`${xl.getExcelCellRef(5, col)}*${bill?.iva / 100}`).style(styles["cell"])
    wsBills.cell(7, col).formula(`${xl.getExcelCellRef(5, col)}*${bill?.taxes / 100}`).style(styles["cell"])
    wsBills.cell(8, col).number(bill?.freeAmount || 0).style(styles["cell"])
    wsBills.cell(9, col).formula(`SUM(${xl.getExcelCellRef(5, col)} : ${xl.getExcelCellRef(8, col)})`).style(styles["importantCell"])
  }

  wsBills.cell(1, 1, 1, 5, true).string(payment?.budget?.supplier?.name).style(styles["sectionHead"])

  let lastBillCol = 0
  const billCells = []
  payment?.white?.bills?.forEach((bill, i) => {
    lastBillCol = 3 * i + 1
    billCells.push(xl.getExcelCellRef(9, lastBillCol))
    writeBillInfo(bill?.bill, bill?.concept == "certificate" ? "CERTIFICADO" : (bill.concept == "mcp" ? "MCP" : "MCD"), 3 * i + 1)
  })

  const totalCol = lastBillCol + 3
  if (payment?.white?.bills?.length) {
    wsBills.cell(5, totalCol).formula(`SUM(${xl.getExcelCellRef(5, 1)}:${xl.getExcelCellRef(5, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(6, totalCol).formula(`SUM(${xl.getExcelCellRef(6, 1)}:${xl.getExcelCellRef(6, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(7, totalCol).formula(`SUM(${xl.getExcelCellRef(7, 1)}:${xl.getExcelCellRef(7, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(8, totalCol).formula(`SUM(${xl.getExcelCellRef(8, 1)}:${xl.getExcelCellRef(8, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(9, totalCol).formula(`SUM(${xl.getExcelCellRef(9, 1)}:${xl.getExcelCellRef(9, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(12, 1, 12, 2, true).string("DETALLE PAGO").style(styles["header"])
  }

  const totalRetention = payment?.white?.payments?.reduce((acc, payment) => acc + payment?.retention?.amount, 0)

  let lastRow = 0
  billCells.forEach((billCell, i) => {
    wsBills.cell(14 + i, 2).formula(`${billCell}`).style(styles["cell"])
    i == billCells.length - 1 && (
      wsBills.cell(14 + i + 2, 2).formula(`SUM(${xl.getExcelCellRef(14, 2)}:${xl.getExcelCellRef(14 + i, 2)})`).style(styles["importantCell"]),
      wsBills.cell(14 + i + 4, 1).string("Retenciones").style(styles["cell"]),
      wsBills.cell(14 + i + 4, 2).number(-totalRetention || 0).style(styles["cell"]),
      wsBills.cell(14 + i + 5, 1).string("A PAGAR").style(styles["importantCell"]),
      wsBills.cell(14 + i + 5, 2).formula(`${xl.getExcelCellRef(14 + i + 2, 2)} + ${xl.getExcelCellRef(14 + i + 4, 2)}`).style(styles["importantCell"]),
      lastRow += 14 + i + 8
    )
  })
  lastRow++

  wsBills.cell(lastRow, 1, lastRow, 6, true).string("DETALLE DE CHEQUES").style(styles["sectionHead"])
  lastRow++
  wsBills.cell(lastRow, 2).string("MONTO").style(styles["importantCell"])
  wsBills.cell(lastRow, 3).string("Fecha de emisión").style(styles["importantCell"])
  wsBills.cell(lastRow, 4).string("Fecha de cobro").style(styles["importantCell"])
  wsBills.cell(lastRow, 5).string("Número de cheque").style(styles["importantCell"])
  wsBills.cell(lastRow, 6).string("Titular cuenta").style(styles["importantCell"])
  lastRow++

  const writeCheckOrPaymentMethod = (payment, type = "Cheque") => {
    wsBills.cell(lastRow, 1).string(`${type}`).style(styles["cell"])
    wsBills.cell(lastRow, 2).number(payment?.amount).style(styles["cell"])
    wsBills.cell(lastRow, 3).string(moment.utc(payment?.emissionDate || payment?.date).format("DD-MM-YYYY")).style(styles["cell"])
    wsBills.cell(lastRow, 4).string(moment.utc(payment?.expirationDate).format("DD-MM-YYYY") || "").style(styles["cell"])
    wsBills.cell(lastRow, 5).string(payment?.code).style(styles["cell"])
    wsBills.cell(lastRow, 6).string(payment?.account?.name || "").style(styles["cell"])
    lastRow++
  }

  const firstPaymentRow = lastRow

  wsBills.cell(lastRow, 1).string(`Descuento UF`).style(styles["cell"])
  wsBills.cell(lastRow, 2).formula(`'CERTIFICADO'!H16`).style(styles["cell"])
  lastRow++

  payment?.white?.payments?.forEach((payment) => {
    payment?.checks?.forEach((check) => {
      writeCheckOrPaymentMethod(check)
    })
    payment?.transfers?.forEach((transfer) => {
      writeCheckOrPaymentMethod(transfer, "Transferencia")
    })
    payment?.materials?.amount && writeCheckOrPaymentMethod(payment?.materials, payment?.materials?.material)
  })

  wsBills.cell(lastRow + 1, 2).formula(`SUM(${xl.getExcelCellRef(firstPaymentRow, 2)}:${xl.getExcelCellRef(lastRow - 1, 2)})`).style(styles["importantCell"])

  return wb
}

export const budgetWhiteExcel = (budget, payments) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet("CUENTA CORRIENTE", {
    sheetFormat: {
      'defaultColWidth': 35,
      'defaultRowHeight': 30,
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -'
    })
  }

  ws.cell(1, 1, 1, 6, true).string(`Cuenta corriente presupuesto ${budget.title} - ${budget?.supplier?.name}`).style(styles["sectionHead"])
  ws.cell(2, 1).string("Fecha").style(styles["importantCell"])
  ws.cell(2, 2).string("Comprobante").style(styles["importantCell"])
  ws.cell(2, 3).string("Descripción").style(styles["importantCell"])
  ws.cell(2, 4).string("Crédito").style(styles["importantCell"])
  ws.cell(2, 5).string("Débito").style(styles["importantCell"])
  ws.cell(2, 6).string("Saldo").style(styles["importantCell"])

  const writeRow = (row, date, code, description, credit = 0, debit = 0) => {
    ws.cell(row, 1).string(date).style(styles["cell"])
    ws.cell(row, 2).string(code).style(styles["cell"])
    ws.cell(row, 3).string(description || code).style(styles["cell"])
    ws.cell(row, 4).number(credit).style(styles["cell"])
    ws.cell(row, 5).number(debit).style(styles["cell"])
    ws.cell(row, 6).formula(row == 3 ? `+${xl.getExcelCellRef(row, 4)} - ${xl.getExcelCellRef(row, 5)}` : `+${xl.getExcelCellRef(row - 1, 6)} + ${xl.getExcelCellRef(row, 4)} - ${xl.getExcelCellRef(row, 5)}`).style(styles["cell"])
  }

  const writeRows = (rows) => {
    rows.sort((a, b) => {
      const date1 = moment(a[1])
      const date2 = moment(b[1])
      return date1.diff(date2)
    })
    rows = rows.map((row) => [row[1].format("DD-MM-YYYY"), row[2], row[3], row[4], row[5]])
    rows.forEach((row, i) => writeRow(i + 3, ...row))
  }

  const addRow = (row, date, code, description, credit = 0, debit = 0) => rows.push([row, date, code, description, credit, debit])

  const rows = []


  let lastRow = 3
  payments?.forEach((payment, i) => {
    payment?.white?.bills?.forEach((bill) => {
      addRow(lastRow, moment.utc(bill?.bill?.emissionDate), bill?.bill?.code, "Factura", 0, bill?.bill?.amount * (1 + (bill?.bill?.iva + bill?.bill?.taxes) / 100) + bill?.bill?.freeAmount)
      lastRow++
      bill?.bill?.notes?.forEach((note) => {
        addRow(lastRow, moment.utc(note?.date), note?.code, `Nota de ${note?.type == "credit" ? "crédito" : "débito"}`, (note?.type == "credit" ? note?.amount : 0), (note?.type == "debit" ? note?.amount : 0))
        lastRow++
      })
    })
    payment?.white?.payments?.forEach(payment => {
      payment?.checks?.forEach(check => {
        addRow(lastRow, moment.utc(check?.emissionDate), check?.code, "Cheque", check?.amount)
        lastRow++
      })
      payment?.transfers?.forEach(transfer => {
        addRow(lastRow, moment.utc(transfer?.emissionDate), transfer?.code, "Transferencia", transfer?.amount)
        lastRow++
      })
      payment?.retention?.amount && (
        addRow(lastRow, moment.utc(payment?.date), payment?.retention?.code, "Retencion", payment?.retention?.amount),
        lastRow++
      )
      payment?.materials?.amount && (
        addRow(lastRow, moment.utc(payment?.materials?.date), "", payment?.materials?.material, payment?.materials?.amount),
        lastRow++
      )
    })
  })

  writeRows(rows)

  return wb
}


export const budgetBlackExcel = (budget, payments) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet("CUENTA CORRIENTE", {
    sheetFormat: {
      'defaultColWidth': 35,
      'defaultRowHeight': 30,
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -'
    })
  }

  ws.cell(1, 1, 1, 6, true).string(`Cuenta corriente B presupuesto ${budget.title} - ${budget?.supplier?.name}`).style(styles["sectionHead"])
  ws.cell(2, 1).string("Fecha").style(styles["importantCell"])
  ws.cell(2, 2).string("Descripción").style(styles["importantCell"])
  ws.cell(2, 3).string("Crédito").style(styles["importantCell"])
  ws.cell(2, 4).string("Débito").style(styles["importantCell"])
  ws.cell(2, 5).string("Moneda").style(styles["importantCell"])
  ws.cell(2, 6).string("Saldo").style(styles["importantCell"])

  const writeRow = (row, date, description, credit = 0, debit = 0, currency = "Pesos") => {
    ws.cell(row, 1).string(date).style(styles["cell"])
    ws.cell(row, 2).string(description || code).style(styles["cell"])
    ws.cell(row, 3).number(credit).style(styles["cell"])
    ws.cell(row, 4).number(debit).style(styles["cell"])
    ws.cell(row, 5).string(currency).style(styles["cell"])
    ws.cell(row, 6).formula(row == 3 ? `+${xl.getExcelCellRef(row, 3)} - ${xl.getExcelCellRef(row, 4)}` : `+${xl.getExcelCellRef(row - 1, 6)} + ${xl.getExcelCellRef(row, 3)} - ${xl.getExcelCellRef(row, 4)}`).style(styles["cell"])
  }

  const writeRows = (rows) => {
    rows.sort((a, b) => {
      const date1 = moment(a[1])
      const date2 = moment(b[1])
      return date1.diff(date2)
    })

    rows = rows.map((row) => [row[1].format("DD-MM-YYYY"), row[2], row[3], row[4], row[5], row[6]])
    rows.forEach((row, i) => writeRow(i + 3, ...row))
  }

  const addRow = (row, date, description, credit = 0, debit = 0, currency = "Pesos") => rows.push([row, date, description, credit, debit, currency])

  const rows = []

  let lastRow = 3
  payments?.forEach((payment, i) => {
    const percentage = (100 - budget?.percentage) || 40
    const adjustment = payment?.indexCac / budget?.baseIndex - 1
    const lastPayment = payments[i - 1] || {}
    const lastMcpApartments = (lastPayment?.discountByApartments * percentage / 100) * (lastPayment?.indexCac / budget?.baseIndex - 1)
    const lastMcdApartments = (lastPayment?.discountByApartments * percentage / 100) * adjustment
    const discountByApartments = payment?.discountByApartments

    const totalApartmentsDiscount = (discountByApartments * percentage / 100) * (1 + adjustment) + ((lastMcdApartments - lastMcpApartments) || 0) || 0

    addRow(lastRow, moment.utc(payment?.date || ""), "Certificado", 0, (payment?.black?.amount + payment?.black?.mcp + ((lastPayment?.black?.mcd - lastPayment?.black?.mcp) || 0)))
    lastRow++
    addRow(lastRow, moment.utc(payment?.date || ""), "Descuento UF", totalApartmentsDiscount, 0)
    lastRow++

    payment?.black?.payments?.forEach((subpayment) => {
      console.log(subpayment)
      addRow(lastRow, moment.utc(subpayment?.date), "Efectivo", subpayment?.currency == "dollar" ? subpayment?.cashPaid * subpayment?.dollarPrice : subpayment.cashPaid, 0, subpayment?.currency == "dollar" ? "Dolar" : "Pesos")
      lastRow++
    })
  })

  writeRows(rows)

  return wb
}

export const projectSupplierExcel = (project, supplier, payments, bills) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet("CUENTA CORRIENTE", {
    sheetFormat: {
      'defaultColWidth': 35,
      'defaultRowHeight': 30,
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -'
    })
  }

  ws.cell(1, 1, 1, 6, true).string(`Cuenta corriente proyecto ${project.title} - ${supplier?.name}`).style(styles["sectionHead"])
  ws.cell(2, 1).string("Fecha").style(styles["importantCell"])
  ws.cell(2, 2).string("Comprobante").style(styles["importantCell"])
  ws.cell(2, 3).string("Descripción").style(styles["importantCell"])
  ws.cell(2, 4).string("Crédito").style(styles["importantCell"])
  ws.cell(2, 5).string("Débito").style(styles["importantCell"])
  ws.cell(2, 6).string("Saldo").style(styles["importantCell"])

  const writeRow = (row, date, code, description, credit = 0, debit = 0) => {
    ws.cell(row, 1).string(date).style(styles["cell"])
    ws.cell(row, 2).string(code).style(styles["cell"])
    ws.cell(row, 3).string(description || code).style(styles["cell"])
    ws.cell(row, 4).number(credit).style(styles["cell"])
    ws.cell(row, 5).number(debit).style(styles["cell"])
    ws.cell(row, 6).formula(row == 3 ? `+${xl.getExcelCellRef(row, 4)} - ${xl.getExcelCellRef(row, 5)}` : `+${xl.getExcelCellRef(row - 1, 6)} + ${xl.getExcelCellRef(row, 4)} - ${xl.getExcelCellRef(row, 5)}`).style(styles["cell"])
  }

  const writeRows = (rows) => {
    rows.sort((a, b) => {
      const date1 = moment(a[1])
      const date2 = moment(b[1])
      return date1.diff(date2)
    })
    rows = rows.map((row) => [row[1].format("DD-MM-YYYY"), row[2], row[3], row[4], row[5]])
    rows.forEach((row, i) => writeRow(i + 3, ...row))
  }

  const addRow = (row, date, code, description, credit = 0, debit = 0) => rows.push([row, date, code, description, credit, debit])

  const rows = []


  let lastRow = 3
  payments?.forEach((payment, i) => {
    payment?.white?.bills?.forEach((bill) => {
      addRow(lastRow, moment.utc(bill?.bill?.emissionDate), bill?.bill?.code, "Factura", 0, bill?.bill?.amount * (1 + (bill?.bill?.iva + bill?.bill?.taxes) / 100) + bill?.bill?.freeAmount)
      lastRow++
      bill?.bill?.notes?.forEach((note) => {
        addRow(lastRow, moment.utc(note?.date), note?.code, `Nota de ${note?.type == "credit" ? "crédito" : "débito"}`, (note?.type == "credit" ? note?.amount : 0), (note?.type == "debit" ? note?.amount : 0))
        lastRow++
      })
    })
    payment?.white?.payments?.forEach((payment, i) => {
      payment?.checks?.forEach(check => {
        addRow(lastRow, moment.utc(check?.emissionDate), check?.code, "Cheque", check?.amount)
        lastRow++
      })
      payment?.transfers?.forEach(transfer => {
        addRow(lastRow, moment.utc(transfer?.emissionDate), transfer?.code, "Transferencia", transfer?.amount)
        lastRow++
      })
      payment?.retention?.amount && (
        addRow(lastRow, moment.utc(payment?.date), payment?.retention?.code, "Retencion", payment?.retention?.amount),
        lastRow++
      )
      payment?.materials?.amount && (
        addRow(lastRow, moment.utc(payment?.materials?.date), "", payment?.materials?.material, payment?.materials?.amount),
        lastRow++
      )
    })
  })

  bills.forEach((bill) => {
    addRow(lastRow, moment.utc(bill?.emissionDate), bill?.code, "Factura", 0, bill?.amount * (1 + (bill?.iva + bill?.taxes) / 100) + bill?.freeAmount)
    lastRow++
    bill?.checks?.forEach(check => {
      addRow(lastRow, moment.utc(check?.emissionDate), check?.code, "Cheque", check?.amount)
      lastRow++
    })
    bill?.transfers?.forEach((transfer) => {
      addRow(lastRow, moment.utc(transfer?.emissionDate), transfer?.code, "Transferencia", transfer?.amount)
      lastRow++
    })
    bill?.notes?.forEach((note) => {
      addRow(lastRow, moment.utc(note?.date), note?.code, `Nota de ${note?.type == "credit" ? "crédito" : "débito"}`, (note?.type == "credit" ? note?.amount : 0), (note?.type == "debit" ? note?.amount : 0))
      lastRow++
    })
    bill?.retention?.amount && (
      addRow(lastRow, moment.utc(bill?.retention?.date), bill?.retention?.code, "Retencion", bill?.retention?.amount),
      lastRow++
    )
  })

  writeRows(rows)

  return wb
}

export const getAccountExcel = (account, movements, filtered) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(`BANCO ${account?.bank || ""}`, {
    defaultFont: {
      size: 9,
      name: 'Ebrima',
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9,
        name: "Ebrima",
        color: "#FFFFFF"
      }
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    notPaidCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    notPaidCellTotal: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 12
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    expiredCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffaaaa",
        fgColor: "#ffaaaa"
      }
    })
  }

  ws.row(1).setHeight(40)

  ws.cell(1, 1, 1, 17, true).string(account?.society?.title || "").style(styles["sectionHead"])
  ws.cell(2, 1, 2, 2, true).string(`BANCO ${account?.bank?.toUpperCase() || ""}`).style({ ...styles["cell"], ...bgSectionInfo })
  ws.cell(3, 1, 3, 2, true).string(`CUIT ${account?.cuit?.toUpperCase() || ""}`).style({ ...styles["cell"], ...bgSectionInfo })
  ws.cell(4, 1, 4, 2, true).string(`CBU ${account?.cbu?.toUpperCase() || ""}`).style({ ...styles["cell"], ...bgSectionInfo })
  ws.cell(5, 1, 5, 2, true).string(`ALIAS ${account?.alias || ""}`).style({ ...styles["cell"], ...bgSectionInfo })

  const dateColumn = 1
  const emissionColumn = 2
  const expirationColumn = 3
  const typeColumn = 4
  const codeColumn = 5
  const lastCheckColumn = 6
  const cashAccountColumn = 7
  const supplierColumn = 8
  const serviceColumn = 9
  const detailColumn = 10
  const creditColumn = 11
  const debitColumn = 12
  const taxColumn = 13
  const sixColumn = 14
  const totalColumn = 15
  const projectedColumn = 16
  const noteColumn = 17



  ws.cell(6, dateColumn).string("FECHA").style(styles["header"])
  ws.cell(6, emissionColumn).string("EMISION").style(styles["header"])
  ws.cell(6, expirationColumn).string("VENCIMIENTO").style(styles["header"])
  ws.cell(6, typeColumn).string("TIPO").style(styles["header"])
  ws.cell(6, codeColumn).string("N°").style(styles["header"])
  ws.cell(6, lastCheckColumn).string("CHQ VENCIDO").style(styles["header"])
  ws.cell(6, cashAccountColumn).string("CUENTA DE INGRESO").style(styles["header"])
  ws.cell(6, supplierColumn).string("PROVEEDOR").style(styles["header"])
  ws.cell(6, serviceColumn).string("SERVICIO").style(styles["header"])
  ws.cell(6, detailColumn).string("DETALLE").style(styles["header"])
  ws.cell(6, creditColumn).string("CREDITO").style(styles["header"])
  ws.cell(6, debitColumn).string("DEBITO").style(styles["header"])
  ws.cell(6, taxColumn).string("SIRCREB").style(styles["header"])
  ws.cell(6, sixColumn).string("6XMIL").style(styles["header"])
  ws.cell(6, totalColumn).string("REAL").style(styles["header"])
  ws.cell(6, projectedColumn).string("PROYECTADO").style(styles["header"])
  ws.cell(6, noteColumn).string("NOTA").style(styles["header"])
  ws.row(6).freeze()

  const orderProperty = filtered ? "expirationDate" : "emissionDate"
  let plusRows = 0
  let monthCount = 0
  let lastMonth = ""


  ws.column(detailColumn).setWidth(40);

  let notPaidCount = 0

  movements.forEach((movement, i) => {
    let thisMonth = moment(movement[orderProperty], "DD-MM-YYYY").format("MMMM")
    thisMonth = thisMonth.charAt(0).toUpperCase() + thisMonth.substring(1)

    let nextMonth = movements.length - 1 >= i + 1 ? moment(movements[i + 1][orderProperty] || "", "DD-MM-YYYY").format("MMMM") : ""
    nextMonth = nextMonth.charAt(0).toUpperCase() + nextMonth.substring(1)
    monthCount++

    if (lastMonth != thisMonth) {
      const addThreeRows = !i ? 0 : 3
      notPaidCount = 0
      monthCount = 0
      ws.cell(7 + i + plusRows + addThreeRows, 1, 7 + i + plusRows + addThreeRows, 17, true).string(`${thisMonth} ${moment(movement[orderProperty], "DD-MM-YYYY").format("YYYY")}`).style(styles["importantCell"]).style({ font: { size: 14, name: "Ebrima" } })
      plusRows += addThreeRows + 1
    }

    const style = (!movement.paid) ? (((moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) && movement?.movementType == "Cheque") || movement?.error) ? "expiredCell" : "notPaidCell") : (movement?.paid ? "cell" : "notPaidCell")
    if (style == "notPaidCell") {
      notPaidCount += (movement?.debit || 0) * 1.006
      notPaidCount -= (movement?.credit || 0) * 0.994
    }

    if (thisMonth != nextMonth) {
      ws.cell(7 + i + plusRows - monthCount - 1, 19).number(notPaidCount).style(styles["notPaidCellTotal"])
    }
    if (movement?.error) {
      if (movement?.debit) {
        movement.credit = movement.debit
      } else {
        movement.debit = movement.credit
      }
    }
    ws.cell(7 + i + plusRows, dateColumn).string(movement?.date || "").style(styles[style])
    ws.cell(7 + i + plusRows, emissionColumn).string(movement?.emissionDate || "").style(styles[style])
    ws.cell(7 + i + plusRows, expirationColumn).string(movement?.expirationDate || "").style(styles[style])
    ws.cell(7 + i + plusRows, typeColumn).string(movement?.movementType || "").style(styles[style])
    ws.cell(7 + i + plusRows, codeColumn).string(movement?.code || "").style(styles[style])
    ws.cell(7 + i + plusRows, lastCheckColumn).string(movement?.lastCheck || "").style(styles[style])
    ws.cell(7 + i + plusRows, cashAccountColumn).string(movement?.cashAccount?.name || "").style(styles[style])
    ws.cell(7 + i + plusRows, supplierColumn).string(movement?.supplier?.name || "").style(styles[style])
    ws.cell(7 + i + plusRows, serviceColumn).string(movement?.service?.name || "").style(styles[style])
    ws.cell(7 + i + plusRows, detailColumn).string(movement?.detail || "").style(styles[style])
    ws.cell(7 + i + plusRows, creditColumn).number(movement?.credit || 0).style(styles[style])
    ws.cell(7 + i + plusRows, debitColumn).number(movement?.debit || 0).style(styles[style])
    ws.cell(7 + i + plusRows, taxColumn).formula(!movement?.error ? `${xl.getExcelCellRef(7 + i + plusRows, creditColumn)} * ${movement?.tax || 0}%` : "0").style(styles[style])
    ws.cell(7 + i + plusRows, sixColumn).formula(!movement?.error ? `(${xl.getExcelCellRef(7 + i + plusRows, creditColumn)} + ${xl.getExcelCellRef(7 + i + plusRows, debitColumn)} + ${xl.getExcelCellRef(7 + i + plusRows, taxColumn)}) * 0.006` : "0").style(styles[style])
    ws.cell(7 + i + plusRows, totalColumn).formula(`${`${i ? xl.getExcelCellRef(lastMonth == thisMonth ? 6 + i + plusRows : 6 + i - 4 + plusRows, totalColumn) : account?.initialBalance} + `} ${(!movement?.paid) ? "0" : `${xl.getExcelCellRef(7 + i + plusRows, creditColumn)} - ${xl.getExcelCellRef(7 + i + plusRows, debitColumn)} - ${xl.getExcelCellRef(7 + i + plusRows, taxColumn)} - ${xl.getExcelCellRef(7 + i + plusRows, sixColumn)}`}`).style(styles[style])
    ws.cell(7 + i + plusRows, projectedColumn).formula(`${`${i ? xl.getExcelCellRef(lastMonth == thisMonth ? 6 + i + plusRows : 6 + i - 4 + plusRows, projectedColumn) : account?.initialBalance} + `} ${((moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) && !movement?.paid && movement?.movementType == "Cheque") || movement?.error) ? 0 : `${xl.getExcelCellRef(7 + i + plusRows, creditColumn)} - ${xl.getExcelCellRef(7 + i + plusRows, debitColumn)} - ${xl.getExcelCellRef(7 + i + plusRows, taxColumn)} - ${xl.getExcelCellRef(7 + i + plusRows, sixColumn)}`}`).style(styles[style])
    ws.cell(7 + i + plusRows, noteColumn).string(movement?.note || "").style(styles[style])
    if (lastMonth != thisMonth) lastMonth = thisMonth
  })

  return wb
}

export const getProjectChecks = (movements, filtered) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(`Cheques`, {
    defaultFont: {
      size: 9,
      name: 'Ebrima',
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9,
        name: "Ebrima",
        color: "#FFFFFF"
      }
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#c6efce",
        fgColor: "#c6efce"
      }
    }),
    commonCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    notPaidCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    notPaidCellTotal: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 12
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    expiredCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ff6969",
        fgColor: "#ff6969"
      }
    })
  }

  ws.row(1).setHeight(40)

  const dateColumn = 1
  const codeColumn = 2
  const emissionColumn = 3
  const bankColumn = 4
  const detailColumn = 5
  const toTheOrderColumn = 6
  const amountColumn = 7
  const checkTypeColumn = 8
  const stateColumn = 9
  const replacedColumn = 10



  ws.cell(1, dateColumn).string("FECHA").style(styles["header"])
  ws.cell(1, codeColumn).string("N° DE CHEQUE").style(styles["header"])
  ws.cell(1, emissionColumn).string("EMISION").style(styles["header"])
  ws.cell(1, bankColumn).string("BANCO").style(styles["header"])
  ws.cell(1, detailColumn).string("CONCEPTO").style(styles["header"])
  ws.cell(1, toTheOrderColumn).string("A LA ORDEN").style(styles["header"])
  ws.cell(1, amountColumn).string("IMPORTE").style(styles["header"])
  ws.cell(1, checkTypeColumn).string("ECHEQ/FISICO").style(styles["header"])
  ws.cell(1, stateColumn).string("ESTADO").style(styles["header"])
  ws.cell(1, replacedColumn).string("REEMPLAZADO").style(styles["header"])
  ws.row(1).freeze()

  const orderProperty = filtered ? "expirationDate" : "emissionDate"
  let plusRows = 0



  ws.column(detailColumn).setWidth(40);
  ws.column(stateColumn).setWidth(25);

  let notPaidCount = 0

  movements.forEach((movement, i) => {

    const style = (!movement.paid && movement?.movementType == "Cheque") ? (moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) || movement?.error ? "expiredCell" : (moment(movement?.date, "DD-MM-YYYY").isAfter(moment()) ? "commonCell" : "notPaidCell")) : "cell"
    if (style == "notPaidCell") {
      notPaidCount += movement?.debit * 1.006
      notPaidCount -= (movement?.credit || 0) * 1.006
    }

    ws.cell(2 + i + plusRows, dateColumn).string(movement?.date || "").style(styles[style])
    ws.cell(2 + i + plusRows, codeColumn).string(movement?.code || "").style(styles[style])
    ws.cell(2 + i + plusRows, emissionColumn).string(movement?.emissionDate || "").style(styles[style])
    ws.cell(2 + i + plusRows, bankColumn).string(movement?.account?.bank || "").style(styles[style])
    ws.cell(2 + i + plusRows, detailColumn).string(movement?.detail || "").style(styles[style])
    ws.cell(2 + i + plusRows, toTheOrderColumn).string(movement?.supplier?.name || movement?.service?.name || movement?.cashAccount?.name || "").style(styles[style])
    ws.cell(2 + i + plusRows, amountColumn).number(movement?.debit || movement?.credit || "").style(styles[style])
    ws.cell(2 + i + plusRows, checkTypeColumn).string(movement?.checkType || "").style(styles[style])
    ws.cell(2 + i + plusRows, stateColumn).string(`${movement?.state != "ERROR" ? (!movement?.paid && moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) ? "VENCIDO" : movement?.state) : `ERROR`}${movement?.note ? " - " + movement?.note : ""}`).style(styles[style])
    ws.cell(2 + i + plusRows, replacedColumn).string(movement?.lastCheck || "").style(styles[style])
  })

  return wb
}

export const incomingChecksExcel = (project, checks) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(`Cheques Recibidos`, {
    defaultFont: {
      size: 9,
      name: 'Ebrima',
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 12,
        name: "Calibri",
        color: "#FFFFFF",
        bold: true
      }
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 11
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#c6efce",
        fgColor: "#c6efce"
      }
    }),
    commonCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 11
      }
    }),
    notPaidCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    notPaidCellTotal: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 12
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    expiredCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ff6969",
        fgColor: "#ff6969"
      }
    })
  }

  ws.row(1).setHeight(40)

  const receivedDateColumn = 1
  const codeColumn = 2
  const emissionColumn = 3
  const dateColumn = 4
  const detailColumn = 5
  const originColumn = 6
  const amountColumn = 7
  const stateColumn = 8
  const operationDateColumn = 9
  const checkTypeColumn = 10
  const transferDetailColumn = 11


  ws.cell(1, receivedDateColumn).string("RECIBIDO").style(styles["header"])
  ws.cell(1, codeColumn).string("N° DE CHEQUE").style(styles["header"])
  ws.cell(1, emissionColumn).string("EMISION").style(styles["header"])
  ws.cell(1, dateColumn).string("PAGO").style(styles["header"])
  ws.cell(1, detailColumn).string("CONCEPTO").style(styles["header"])
  ws.cell(1, originColumn).string("LIBRADOR").style(styles["header"])
  ws.cell(1, amountColumn).string("IMPORTE").style(styles["header"])
  ws.cell(1, stateColumn).string("ESTADO").style(styles["header"])
  ws.cell(1, operationDateColumn).string("F. OPERACION").style(styles["header"])
  ws.cell(1, checkTypeColumn).string("ECHEQ/FISICO").style(styles["header"])
  ws.cell(1, transferDetailColumn).string("DETALLE OPERACION").style(styles["header"])
  ws.row(1).freeze()

  let plusRows = 0

  for (let i = 1; i < transferDetailColumn + 1; i++) {
    ws.column(i).setWidth(16);
  }

  ws.column(detailColumn).setWidth(40);
  ws.column(transferDetailColumn).setWidth(30);
  ws.column(stateColumn).setWidth(25);

  let notPaidCount = 0

  checks.forEach((check, i) => {

    //const style = (!check.paid && check?.checkType == "Cheque") ? (moment(check?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) || check?.error ? "expiredCell" : (moment(check?.date, "DD-MM-YYYY").isAfter(moment()) ? "commonCell" : "notPaidCell")) : "cell"
    const style = check?.state == "RECHAZADO" ? "expiredCell" : ((check?.state == "ACEPTADO" || !check?.state) ? "commonCell" : "cell")


    ws.cell(2 + i + plusRows, receivedDateColumn).string(moment.utc(check?.receivedDate).format("DD-MM-YYYY") || "").style(styles[style])
    ws.cell(2 + i + plusRows, codeColumn).string(check?.code || "").style(styles[style])
    ws.cell(2 + i + plusRows, emissionColumn).string(moment.utc(check?.emissionDate).format("DD-MM-YYYY") || "").style(styles[style])
    ws.cell(2 + i + plusRows, dateColumn).string(moment.utc(check?.date).format("DD-MM-YYYY") || "").style(styles[style])
    ws.cell(2 + i + plusRows, detailColumn).string(check?.detail || "").style(styles[style])
    ws.cell(2 + i + plusRows, originColumn).string(check?.origin).style(styles[style])
    ws.cell(2 + i + plusRows, amountColumn).number(check?.amount || "").style(styles[style])
    ws.cell(2 + i + plusRows, stateColumn).string(`${check?.state || "En cartera"}${(check?.state == "ACEPTADO" || check?.state == "DEPOSITADO" || check?.state == "RECHAZADO") ? " - " + check?.account?.bank : ""}`).style(styles[style])
    ws.cell(2 + i + plusRows, operationDateColumn).string(moment.utc(check?.operationDate).format("DD-MM-YYYY") || "").style(styles[style])
    ws.cell(2 + i + plusRows, checkTypeColumn).string(check?.checkType || "").style(styles[style])
    ws.cell(2 + i + plusRows, transferDetailColumn).string(check?.transferDetail || "").style(styles[style])
  })

  return wb
}

export const cashMovementsExcel = (movements, dollar) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(`CAJA`, {
    defaultFont: {
      size: 9,
      name: 'Ebrima',
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 12,
        name: "Calibri",
        color: "#FFFFFF",
        bold: true
      }
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 11
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#c6efce",
        fgColor: "#c6efce"
      }
    }),
    commonCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 11
      }
    }),
    notPaidCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    notPaidCellTotal: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 12
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    expiredCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ff6969",
        fgColor: "#ff6969"
      }
    })
  }

  ws.row(1).setHeight(40)

  const dateColumn = 1
  const detailColumn = 2
  const creditColumn = 3
  const debitColumn = 4
  const balanceColumn = 5

  let headerStyles = styles["header"]
  if (dollar) headerStyles = {
    ...headerStyles, fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#25853f",
      fgColor: "#25853f"
    }
  }

  ws.cell(1, dateColumn).string("FECHA").style(headerStyles)
  ws.cell(1, detailColumn).string("CONCEPTO").style(headerStyles)
  ws.cell(1, creditColumn).string("INGRESO").style(headerStyles)
  ws.cell(1, debitColumn).string("EGRESO").style(headerStyles)
  ws.cell(1, balanceColumn).string("SALDO").style(headerStyles)
  ws.row(1).freeze()

  let plusRows = 0


  ws.column(detailColumn).setWidth(30);


  movements.forEach((movement, i) => {

    //const style = (!movement.paid && movement?.movementType == "Cheque") ? (moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) || movement?.error ? "expiredCell" : (moment(movement?.date, "DD-MM-YYYY").isAfter(moment()) ? "commonCell" : "notPaidCell")) : "cell"
    const style = movement?.state == "RECHAZADO" ? "expiredCell" : ((movement?.state == "ACEPTADO" || !movement?.state) ? "commonCell" : "cell")


    ws.cell(2 + i + plusRows, dateColumn).string(moment.utc(movement?.date).format("DD-MM-YYYY") || "").style(styles[style])
    ws.cell(2 + i + plusRows, detailColumn).string(movement?.detail || 0).style(styles[style])
    ws.cell(2 + i + plusRows, creditColumn).number(movement?.credit || 0).style(styles[style])
    ws.cell(2 + i + plusRows, debitColumn).number(movement?.debit || 0).style(styles[style])
    ws.cell(2 + i + plusRows, balanceColumn).formula(`${i ? xl.getExcelCellRef(1 + i + plusRows, balanceColumn) + " + " : ""}${xl.getExcelCellRef(2 + i + plusRows, creditColumn)} - ${xl.getExcelCellRef(2 + i + plusRows, debitColumn)}`).style(styles[style])
  })

  return wb
}

export const getCashAccountExcel = (account, movements, filtered = false) => {
  const wb = new xl.Workbook()

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9,
        name: "Ebrima",
        color: "#FFFFFF"
      }
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    })
  }

  const projects = []
  movements.forEach(m => {
    const actualSociety = m?.account?.society?.title
    !projects.some(p => p == actualSociety) && projects.push(actualSociety)
  })

  projects.forEach(project => {
    console.log(project)
    let projectMovements = []
    projectMovements = movements.filter(m => m?.account?.society?.title == project)
    const ws = wb.addWorksheet(`${project || ""}`, {
      defaultFont: {
        size: 9,
        name: 'Ebrima',
      }
    })
    ws.row(1).setHeight(40)

    ws.cell(1, 1, 1, 6, true).string(`${account?.name || ""} - ${project}`).style(styles["sectionHead"])

    ws.cell(3, 1).string("FECHA").style(styles["header"])
    ws.cell(3, 2).string("BANCO").style(styles["header"])
    ws.cell(3, 3).string("SOCIEDAD").style(styles["header"])
    ws.cell(3, 4).string("N° DE CUENTA").style(styles["header"])
    ws.cell(3, 5).string("IMPORTE").style(styles["header"])
    ws.cell(3, 6).string("TOTAL").style(styles["header"])
    ws.row(3).freeze()

    const orderProperty = filtered ? "expirationDate" : "emissionDate"
    let plusRows = 0
    let lastMonth = ""

    projectMovements.forEach((movement, i) => {
      let thisMonth = moment.utc(movement[orderProperty]).format("MMMM")
      thisMonth = thisMonth.charAt(0).toUpperCase() + thisMonth.substring(1)

      if (lastMonth != thisMonth) {
        const addThreeRows = !i ? 0 : 3
        ws.cell(7 + plusRows + addThreeRows, 1, 7 + plusRows + addThreeRows, 6, true).string(`${thisMonth} ${moment.utc(movement[orderProperty]).format("YYYY")}`).style(styles["importantCell"]).style({ font: { size: 14, name: "Ebrima" } })
        plusRows += addThreeRows + 1
      }

      ws.cell(7 + plusRows, 1).string(moment.utc(movement?.emissionDate).format("DD-MM-YYYY") || "").style(styles["cell"])
      ws.cell(7 + plusRows, 2).string(movement?.account?.bank || "").style(styles["cell"])
      ws.cell(7 + plusRows, 3).string(movement?.account?.society?.title || "").style(styles["cell"])
      ws.cell(7 + plusRows, 4).string(movement?.account?.accountNumber || "").style(styles["cell"])
      ws.cell(7 + plusRows, 5).number(movement?.credit || 0).style(styles["cell"])
      ws.cell(7 + plusRows, 6).formula(`${(!i || lastMonth != thisMonth) ? "0" : xl.getExcelCellRef(7 + plusRows - 1, 6)} + ${xl.getExcelCellRef(7 + plusRows, 5)}`).style(styles["cell"])
      plusRows++
      if (lastMonth != thisMonth) lastMonth = thisMonth
    })
  })
  return wb
}

export const getSupplierOrServiceExcel = (supplier, project, movements, filtered = false, service = false) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(`${supplier?.name || ""}`, {
    defaultFont: {
      size: 9,
      name: 'Ebrima',
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9,
        name: "Ebrima",
        color: "#FFFFFF"
      }
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    })
  }


  ws.row(1).setHeight(40)

  ws.cell(1, 1, 1, 8, true).string(`${supplier?.name || ""} ${!service ? ` - ${project?.title || ""}` : ""}`).style(styles["sectionHead"])

  const dateCol = 1
  const bankCol = 2
  const societyCol = 3
  const accountNumberCol = 4
  const codeCol = 5
  const lastCheckCol = 6
  const amountCol = 7
  const totalCol = 8


  ws.cell(3, dateCol).string("FECHA").style(styles["header"])
  ws.cell(3, bankCol).string("BANCO").style(styles["header"])
  ws.cell(3, societyCol).string("SOCIEDAD").style(styles["header"])
  ws.cell(3, accountNumberCol).string("N° DE CUENTA").style(styles["header"])
  ws.cell(3, codeCol).string("CHQ/TRANSF").style(styles["header"])
  ws.cell(3, lastCheckCol).string("CHEQUE ANTERIOR").style(styles["header"])
  ws.cell(3, amountCol).string("IMPORTE").style(styles["header"])
  ws.cell(3, totalCol).string("TOTAL").style(styles["header"])
  ws.row(3).freeze()

  const orderProperty = filtered ? "expirationDate" : "emissionDate"
  let plusRows = 0
  let lastMonth = ""

  movements.forEach((movement, i) => {
    if (!moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) || (moment(movement?.expirationDate, "DD-MM-YYYY").add(33, "days")?.isBefore(moment()) && movement?.paid)) {
      let thisMonth = moment.utc(movement?.emissionDate).format("MMMM")
      thisMonth = thisMonth.charAt(0).toUpperCase() + thisMonth.substring(1)

      if (lastMonth != thisMonth) {
        const addThreeRows = !i ? 0 : 3
        ws.cell(7 + plusRows + addThreeRows, 1, 7 + plusRows + addThreeRows, 8, true).string(`${thisMonth} ${moment(movement[orderProperty], "DD-MM-YYYY").format("YYYY")} `).style(styles["importantCell"]).style({ font: { size: 14, name: "Ebrima" } })
        plusRows += addThreeRows + 1
      }

      ws.cell(7 + plusRows, dateCol).string(moment.utc(movement?.emissionDate).format("DD-MM-YYYY") || "").style(styles["cell"])
      ws.cell(7 + plusRows, bankCol).string(movement?.account?.bank || "").style(styles["cell"])
      ws.cell(7 + plusRows, societyCol).string(movement?.account?.society?.title || "").style(styles["cell"])
      ws.cell(7 + plusRows, accountNumberCol).string(movement?.account?.accountNumber || "").style(styles["cell"])
      ws.cell(7 + plusRows, amountCol).number(movement?.debit ? (movement?.debit || 0) : (-movement?.credit || 0)).style(styles["cell"])
      ws.cell(7 + plusRows, codeCol).string(movement?.code || 0).style(styles["cell"])
      ws.cell(7 + plusRows, lastCheckCol).string(movement?.lastCheck || 0).style(styles["cell"])
      ws.cell(7 + plusRows, totalCol).formula(`${(!i || lastMonth != thisMonth) ? "0" : xl.getExcelCellRef(7 + plusRows - 1, totalCol)} + ${xl.getExcelCellRef(7 + plusRows, amountCol)} `).style(styles["cell"])
      plusRows++
      if (lastMonth != thisMonth) lastMonth = thisMonth
    }
  })
  return wb
}


export const getExcelService = (supplier, project, movements, filtered = false, service = false) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(`${supplier?.name || ""}`, {
    defaultFont: {
      size: 9,
      name: 'Ebrima',
    }
  })

  const styles = {
    sectionHead: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    header: wb.createStyle({
      ...fontHeadStyle,
      ...textCenterStyle,
      ...boldBorder,
      ...bgHead,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9,
        name: "Ebrima",
        color: "#FFFFFF"
      }
    }),
    importantCell: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...thinBorder,
      ...bgSectionInfo,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    cell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      }
    }),
    notPaidCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#e8cc84",
        fgColor: "#e8cc84"
      }
    }),
    expiredCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -',
      font: {
        size: 9
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#ffaaaa",
        fgColor: "#ffaaaa"
      }
    })
  }


  ws.row(1).setHeight(40)

  ws.cell(1, 1, 1, 8, true).string(`${supplier?.name || ""} - ${supplier?.code || ""}`).style(styles["sectionHead"])

  const dateCol = 1
  const bankCol = 2
  const societyCol = 3
  const accountNumberCol = 4
  const codeCol = 5
  const amountCol = 6
  const totalCol = 7
  const noteCol = 8


  ws.cell(3, dateCol).string("FECHA").style(styles["header"])
  ws.cell(3, bankCol).string("BANCO").style(styles["header"])
  ws.cell(3, societyCol).string("SOCIEDAD").style(styles["header"])
  ws.cell(3, accountNumberCol).string("N° DE CUENTA").style(styles["header"])
  ws.cell(3, codeCol).string("N° VEP/CUOTA").style(styles["header"])
  ws.cell(3, amountCol).string("IMPORTE").style(styles["header"])
  ws.cell(3, totalCol).string("TOTAL").style(styles["header"])
  ws.cell(3, noteCol).string("NOTA").style(styles["header"])
  ws.row(3).freeze()

  const orderProperty = filtered ? "expirationDate" : "emissionDate"
  let plusRows = 0
  let lastMonth = ""

  movements.forEach((movement, i) => {
    let thisMonth = moment.utc(movement?.expirationDate).format("MMMM")
    thisMonth = thisMonth.charAt(0).toUpperCase() + thisMonth.substring(1)
    if (lastMonth != thisMonth) {
      const addThreeRows = !i ? 0 : 3
      ws.cell(7 + plusRows + addThreeRows, 1, 7 + plusRows + addThreeRows, 8, true).string(`${thisMonth} ${moment.utc(movement["expirationDate"], "DD-MM-YYYY").format("YYYY")} `).style(styles["importantCell"]).style({ font: { size: 14, name: "Ebrima" } })
      plusRows += addThreeRows + 1
    }

    const style = movement?.error ? styles["expiredCell"] : styles["cell"]

    ws.cell(7 + plusRows, dateCol).string(movement?.date ? moment.utc(movement?.date).format("DD-MM-YYYY") : "No pago").style(style)
    ws.cell(7 + plusRows, bankCol).string(movement?.account?.bank || "").style(style)
    ws.cell(7 + plusRows, societyCol).string(movement?.account?.society?.title || "").style(style)
    ws.cell(7 + plusRows, accountNumberCol).string(movement?.account?.accountNumber || "").style(style)
    ws.cell(7 + plusRows, amountCol).number(movement?.debit ? (movement?.debit || 0) : (-movement?.credit || 0)).style(style)
    ws.cell(7 + plusRows, codeCol).string(!i ? movement?.code : String(i)).style(style)
    ws.cell(7 + plusRows, totalCol).formula(`${(!i || lastMonth != thisMonth) ? "0" : xl.getExcelCellRef(7 + plusRows - 1, totalCol)} + ${movement?.error ? "0" : xl.getExcelCellRef(7 + plusRows, amountCol)} `).style(style)
    ws.cell(7 + plusRows, noteCol).string(movement?.note || "").style(style)
    plusRows++
    if (lastMonth != thisMonth) lastMonth = thisMonth
  })
  return wb
}