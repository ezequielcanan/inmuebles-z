import xl from "excel4node"
import { textCenterStyle, thinBorder, boldBorder, bgHead, bgSectionInfo, fontHeadStyle } from "./index.js"


export const paymentExcel = (payment, lastPayment) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet("CERTIFICADO", {
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
    ws.cell(3, col).string(type).style(styles["sectionHead"])
    ws.cell(4, col).string("Subtotal").style(styles["importantCell"])
    ws.cell(5, col).string("Mayor costo").style(styles["cell"])
    ws.cell(6, col).string("Mayor costo definitivo").style(styles["cell"])
    ws.cell(7, col).string("Total").style(styles["cell"])
    type == "A" && ws.cell(8, col).string("IVA:").style(styles["cell"])
    type == "A" && ws.cell(9, col).string("Impuestos:").style(styles["cell"])
    ws.cell(10, col).string("Total a pagar:").style(styles["importantCell"])
    ws.cell(12, col).string("A cobrar unidades:").style(styles["importantCell"])
    ws.cell(13, col).string("Mayor costo").style(styles["cell"])
    ws.cell(14, col).string("Mayor costo definitivo").style(styles["cell"])
    ws.cell(15, col).string("Total:").style(styles["cell"])
    type == "A" && ws.cell(16, col).string("IVA:").style(styles["cell"])
    type == "A" && ws.cell(17, col).string("Impuestos:").style(styles["cell"])
    ws.cell(18, col).string("Total a cobrar:").style(styles["importantCell"])
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
    type == "white" && ws.cell(16, col).formula(`${xl.getExcelCellRef(15, col)} * ${(payment?.bill?.iva || 0)}% `).style(styles["cell"])
    type == "white" && ws.cell(17, col).formula(`${xl.getExcelCellRef(15, col)} * ${(payment?.bill?.taxes || 0)}% `).style(styles["cell"])
    ws.cell(18, col).formula(`SUM(${xl.getExcelCellRef(15, col)}: ${xl.getExcelCellRef(17, col)})`).style(styles["cell"])
    ws.cell(20, col).formula(`${xl.getExcelCellRef(10, col)} -${xl.getExcelCellRef(18, col)} `).style(styles["sectionHead"])
    ws.column(col).setWidth(35)
  }

  writeSectionImportantCells("A")
  writeSectionImportantCells("B", 1)
  writeSectionInfo(payment?.budget?.percentage)
  writeSectionInfo((100 - payment?.budget?.percentage), "black", 2)


  return wb
}
