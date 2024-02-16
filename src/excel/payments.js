import xl from "excel4node"
import { textCenterStyle, thinBorder, boldBorder, bgHead, bgSectionInfo, fontHeadStyle, bgSectionHead } from "./index.js"
import moment from "moment"

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


  ws.cell(1, 1).string("Total").style(styles["sectionHead"])
  ws.cell(1, 2).number(payment?.amount).style(styles["importantCell"])

  ws.cell(1, 4).string("Total unidades").style(styles["sectionHead"])
  ws.cell(1, 5).number(payment?.discountByApartments).style(styles["importantCell"])

  ws.cell(3, 4, 3, 5, true).string("Actualizacion").style(styles["importantCell"])
  ws.cell(4, 4).string("Indice base").style(styles["importantCell"])
  ws.cell(4, 5).number(payment?.budget?.baseIndex).style(styles["importantCell"])
  ws.cell(5, 4).string("Indice actual").style(styles["importantCell"])
  ws.cell(5, 5).number(payment?.indexCac).style(styles["importantCell"])
  ws.cell(6, 4).string("Aumento").style(styles["importantCell"])
  ws.cell(6, 5).formula(`E5 / E4 - 1`).style(styles["importantCell"])

  const writeSectionImportantCells = (type = "A", col = 7) => {
    ws.cell(3, col, 3, col + 1, true).string(type).style(styles["sectionHead"])
    ws.cell(4, col).string("Subtotal").style(styles["importantCell"])
    ws.cell(5, col).string("Mayor costo").style(styles["cell"])
    ws.cell(6, col).string("Mayor costo definitivo").style(styles["cell"])
    ws.cell(7, col).string("Total").style(styles["cell"])
    type == "A" && ws.cell(8, col).string("IVA:").style(styles["cell"])
    type == "A" && ws.cell(9, col).string("Impuestos:").style(styles["cell"])
    ws.cell(10, col).string("Total a pagar:").style(styles["header"])
    ws.cell(12, col).string("A cobrar unidades:").style(styles["importantCell"])
    ws.cell(13, col).string("Mayor costo").style(styles["cell"])
    ws.cell(14, col).string("Mayor costo definitivo").style(styles["cell"])
    ws.cell(15, col).string("Total:").style(styles["cell"])
    ws.cell(16, col).string("Total a cobrar:").style(styles["header"])
    ws.cell(20, col).string("SALDO A PAGAR").style(styles["importantCell"])
  }

  const adjustmentCell = "E6"

  const writeSectionInfo = (percentage, type = "white", col = 8) => {

    const lastMcpApartments = (lastPayment?.discountByApartments * percentage / 100) * (lastPayment?.indexCac / payment?.budget?.baseIndex - 1)
    const lastMcdApartments = (lastPayment?.discountByApartments * percentage / 100) * (payment?.indexCac / payment?.budget?.baseIndex - 1)

    ws.cell(4, col).formula(`B1 * ${percentage}%`).style(styles["cell"])
    ws.cell(5, col).formula(`${xl.getExcelCellRef(4, col)} * ${adjustmentCell}`).style(styles["cell"])
    ws.cell(6, col).number(0).style(styles["cell"])
    ws.cell(7, col).formula(`SUM(${xl.getExcelCellRef(4, col)}:${xl.getExcelCellRef(6, col)})`).style(styles["cell"])
    type == "white" && ws.cell(8, col).formula(`${xl.getExcelCellRef(7, col)} * ${(payment?.bill?.iva || 0)}% `).style(styles["cell"])
    type == "white" && ws.cell(9, col).formula(`${xl.getExcelCellRef(7, col)} * ${(payment?.bill?.taxes || 0)}% `).style(styles["cell"])
    ws.cell(10, col).formula(`SUM(${xl.getExcelCellRef(7, col)}: ${xl.getExcelCellRef(9, col)})`).style(styles["cell"])
    ws.cell(12, col).formula(`E1 * ${percentage}% `).style(styles["cell"])
    ws.cell(13, col).formula(`${xl.getExcelCellRef(12, col)} * ${adjustmentCell} `).style(styles["cell"])
    ws.cell(14, col).number((lastMcdApartments - lastMcpApartments) || 0).style(styles["cell"])
    ws.cell(15, col).formula(`SUM(${xl.getExcelCellRef(12, col)}: ${xl.getExcelCellRef(14, col)})`).style(styles["cell"])
    ws.cell(16, col).formula(`${xl.getExcelCellRef(15, col)}`).style(styles["cell"])
    ws.cell(20, col).formula(`${xl.getExcelCellRef(10, col)} - ${xl.getExcelCellRef(16, col)}`).style(styles["sectionHead"])
    ws.column(col).setWidth(35)
  }

  writeSectionImportantCells("A")
  writeSectionImportantCells("B", 1)
  writeSectionInfo(payment?.budget?.percentage)
  writeSectionInfo((100 - payment?.budget?.percentage), "black", 2)

  const writeBillInfo = (bill, concept, col = 1) => {
    wsBills.cell(3, col).string(bill?.code).style(styles["header"])
    wsBills.cell(3, col + 1).string(concept).style(styles["header"])
    wsBills.cell(4, col).string(`IVA ${bill?.iva}%`).style(styles["cell"])
    wsBills.cell(5, col).number(bill?.amount).style(styles["cell"])
    wsBills.cell(6, col).formula(`${xl.getExcelCellRef(5, col)}*${bill?.iva / 100}`).style(styles["cell"])
    wsBills.cell(7, col).formula(`${xl.getExcelCellRef(5, col)}*${bill?.taxes / 100}`).style(styles["cell"])
    wsBills.cell(8, col).formula(`SUM(${xl.getExcelCellRef(5, col)} : ${xl.getExcelCellRef(7, col)})`).style(styles["importantCell"])
  }

  wsBills.cell(1, 1, 1, 5, true).string(payment?.budget?.supplier?.name).style(styles["sectionHead"])

  let lastBillCol = 0
  const billCells = []
  payment?.white?.bills?.forEach((bill, i) => {
    lastBillCol = 3 * i + 1
    billCells.push(xl.getExcelCellRef(8, lastBillCol))
    writeBillInfo(bill?.bill, bill?.concept == "certificate" ? "CERTIFICADO" : (bill.concept == "mcp" ? "MCP" : "MCD"), 3 * i + 1)
  })

  const totalCol = lastBillCol + 3
  if (payment?.white?.bills?.length) {
    wsBills.cell(5, totalCol).formula(`SUM(${xl.getExcelCellRef(5, 1)}:${xl.getExcelCellRef(5, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(6, totalCol).formula(`SUM(${xl.getExcelCellRef(6, 1)}:${xl.getExcelCellRef(6, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(7, totalCol).formula(`SUM(${xl.getExcelCellRef(7, 1)}:${xl.getExcelCellRef(7, lastBillCol)})`).style(styles["importantCell"])
    wsBills.cell(8, totalCol).formula(`SUM(${xl.getExcelCellRef(8, 1)}:${xl.getExcelCellRef(8, lastBillCol)})`).style(styles["importantCell"])
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
  const ws = wb.addWorksheet("CERTIFICADO", {
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
      addRow(lastRow, moment.utc(bill?.bill?.emissionDate), bill?.bill?.code, "Factura", 0, bill?.bill?.amount * (1 + (bill?.bill?.iva + bill?.bill?.taxes) / 100))
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