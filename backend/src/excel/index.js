import xl from "excel4node"


export const createTransactionExcel = (transaction, quotas) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet()
  const wsBlack = wb.addWorksheet()

  const { black, white } = quotas

  const { apartment } = transaction

  const styles = {
    project: wb.createStyle({
      font: {
        size: 18,
        bold: true,
        color: "#FFFFFF"
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        left: {
          style: 'medium',
          color: 'black',
        },
        right: {
          style: 'medium',
          color: 'black',
        },
        top: {
          style: 'medium',
          color: 'black',
        },
        bottom: {
          style: 'medium',
          color: 'black',
        },
        outline: false,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#516480",
        fgColor: "#516480"
      }
    }),
    apartmentInfoHead: wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        left: {
          style: 'medium',
          color: 'black',
        },
        right: {
          style: 'medium',
          color: 'black',
        },
        top: {
          style: 'medium',
          color: 'black',
        },
        bottom: {
          style: 'medium',
          color: 'black',
        },
        outline: false,
      },
    }),
    apartmentInfoCell: wb.createStyle({
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        left: {
          style: 'thin',
          color: 'black',
        },
        right: {
          style: 'thin',
          color: 'black',
        },
        top: {
          style: 'thin',
          color: 'black',
        },
        bottom: {
          style: 'thin',
          color: 'black',
        },
        outline: false,
      },
    }),
    sectionHead: wb.createStyle({
      font: {
        size: 14,
        bold: true,
        color: "#FFFFFF"
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        left: {
          style: 'medium',
          color: 'black',
        },
        right: {
          style: 'medium',
          color: 'black',
        },
        top: {
          style: 'medium',
          color: 'black',
        },
        bottom: {
          style: 'medium',
          color: 'black',
        },
        outline: false,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#8497B0",
        fgColor: "#8497B0"
      }
    }),
    sectionInfoHead: wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        left: {
          style: 'medium',
          color: 'black',
        },
        right: {
          style: 'medium',
          color: 'black',
        },
        top: {
          style: 'medium',
          color: 'black',
        },
        bottom: {
          style: 'medium',
          color: 'black',
        },
        outline: false,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#b7daf6",
        fgColor: "#b7daf6"
      }
    }),
    quota: wb.createStyle({
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      },
      border: {
        left: {
          style: 'thin',
          color: 'black',
        },
        right: {
          style: 'thin',
          color: 'black',
        },
        top: {
          style: 'thin',
          color: 'black',
        },
        bottom: {
          style: 'thin',
          color: 'black',
        },
        outline: false,
      },
      numberFormat: '#.00; -#.00; -'
    })
  }

  ws.column(1).setWidth(20);
  ws.column(2).setWidth(20);
  ws.column(3).setWidth(20);
  ws.column(4).setWidth(20);
  ws.column(5).setWidth(20);
  ws.column(6).setWidth(20);
  ws.column(7).setWidth(20);
  ws.column(8).setWidth(20);
  ws.column(9).setWidth(20);
  ws.column(10).setWidth(20);
  ws.column(11).setWidth(20);
  ws.column(12).setWidth(20);
  ws.column(13).setWidth(20);

  wsBlack.column(1).setWidth(20);
  wsBlack.column(2).setWidth(20);
  wsBlack.column(3).setWidth(20);
  wsBlack.column(4).setWidth(20);
  wsBlack.column(5).setWidth(20);
  wsBlack.column(6).setWidth(20);
  wsBlack.column(7).setWidth(20);
  wsBlack.column(8).setWidth(20);
  wsBlack.column(9).setWidth(20);
  wsBlack.column(10).setWidth(20);
  wsBlack.column(11).setWidth(20);
  wsBlack.column(12).setWidth(20);
  wsBlack.column(13).setWidth(20);


  ws.cell(1, 1, 1, transaction?.white?.baseIndex ? 13 : 12, true).string(apartment?.project?.title).style(styles["project"])

  ws.cell(2, 1).string("UF").style(styles["apartmentInfoHead"])
  ws.cell(2, 2).string("m2 Cubiertos").style(styles["apartmentInfoHead"])
  ws.cell(2, 3).string("m2 Balcon").style(styles["apartmentInfoHead"])
  ws.cell(2, 4).string("m2 Descubiertos").style(styles["apartmentInfoHead"])
  ws.cell(2, 5).string("Amenities").style(styles["apartmentInfoHead"])
  ws.cell(2, 6).string("Total m2").style(styles["apartmentInfoHead"])
  ws.cell(2, 7).string("Tipo UF").style(styles["apartmentInfoHead"])
  ws.cell(2, 8).string("TOTAL").style(styles["apartmentInfoHead"])
  ws.cell(2, 9).string("60%").style(styles["apartmentInfoHead"])
  ws.cell(2, 10).string("Adelanto").style(styles["apartmentInfoHead"])
  ws.cell(2, 11).string("Saldo").style(styles["apartmentInfoHead"])
  ws.cell(2, 12).string("Cuotas").style(styles["apartmentInfoHead"])
  if (transaction?.white?.baseIndex) {
    ws.cell(2, 13).string("Indice base").style(styles["apartmentInfoHead"])
    ws.cell(3, 13).number(transaction?.white?.baseIndex).style(styles["apartmentInfoCell"])
  }

  const indexAdd = transaction?.white?.baseIndex ? 1 : 0

  wsBlack.cell(1, 1).string("40%").style(styles["apartmentInfoHead"])
  wsBlack.cell(1, 2).string("Adelanto").style(styles["apartmentInfoHead"])
  wsBlack.cell(1, 3).string("Saldo").style(styles["apartmentInfoHead"])
  wsBlack.cell(1, 4).string("Cuotas").style(styles["apartmentInfoHead"])

  ws.cell(3, 1).string(apartment?.unit).style(styles["apartmentInfoCell"])
  ws.cell(3, 2).number(apartment?.meters?.covered).style(styles["apartmentInfoCell"])
  ws.cell(3, 3).number(apartment?.meters?.balcony).style(styles["apartmentInfoCell"])
  ws.cell(3, 4).number(apartment?.meters?.uncovered).style(styles["apartmentInfoCell"])
  ws.cell(3, 5).number(apartment?.meters?.amenities).style(styles["apartmentInfoCell"])
  ws.cell(3, 6).number(apartment?.meters?.total).style(styles["apartmentInfoCell"])
  ws.cell(3, 7).string(apartment?.rooms).style(styles["apartmentInfoCell"])
  ws.cell(3, 8).number(transaction?.total).style(styles["apartmentInfoCell"])
  ws.cell(3, 9).formula(`${xl.getExcelCellRef(3, 8)} * 60%`).style(styles["apartmentInfoCell"])
  ws.cell(3, 10).number(transaction?.booking).style(styles["apartmentInfoCell"])
  ws.cell(3, 11).formula(`${xl.getExcelCellRef(3, 9)} - ${xl.getExcelCellRef(3, 10)}`).style(styles["apartmentInfoCell"])
  ws.cell(3, 12).number(transaction?.white?.quotas).style(styles["apartmentInfoCell"])

  wsBlack.cell(2, 1).formula(`'Sheet 1'!H3 * 40%`).style(styles["apartmentInfoCell"])
  wsBlack.cell(2, 2).number(transaction?.bookingB).style(styles["apartmentInfoCell"])
  wsBlack.cell(2, 3).formula(`${xl.getExcelCellRef(2, 1)} - ${xl.getExcelCellRef(2, 2)}`).style(styles["apartmentInfoCell"])
  wsBlack.cell(2, 4).number(transaction?.black?.quotas).style(styles["apartmentInfoCell"])

  ws.cell(5, 1, 5, 8, true).string("A").style(styles["sectionHead"])
  ws.cell(6, 1).string("Nombre").style(styles["sectionInfoHead"])
  ws.cell(6, 2).string("N° Cuota").style(styles["sectionInfoHead"])
  ws.cell(6, 3).string("Cuota").style(styles["sectionInfoHead"])

  const writeQuotasHeaders = (type, row, index, sheet = ws) => {
    sheet.cell(row - 1, 1, row - 1, index ? 9 : 8, true).string(type).style(styles["sectionHead"])
    const addRowIfIndex = index ? 1 : 0
    sheet.cell(row, 1).string("Nombre").style(styles["sectionInfoHead"])
    sheet.cell(row, 2).string("N° Cuota").style(styles["sectionInfoHead"])
    sheet.cell(row, 3).string("Cuota").style(styles["sectionInfoHead"])
    index && sheet.cell(row, 4).string("Indice").style(styles["sectionInfoHead"])
    sheet.cell(row, 4 + addRowIfIndex).string("Porcentaje").style(styles["sectionInfoHead"])
    sheet.cell(row, 5 + addRowIfIndex).string("Ajuste").style(styles["sectionInfoHead"])
    sheet.cell(row, 6 + addRowIfIndex).string("Cuota actual").style(styles["sectionInfoHead"])
    sheet.cell(row, 7 + addRowIfIndex).string("Fecha").style(styles["sectionInfoHead"])
    sheet.cell(row, 8 + addRowIfIndex).string("Total Abonado").style(styles["sectionInfoHead"])
  }

  if (!transaction?.white?.baseIndex) {

    writeQuotasHeaders("A", 6, null)

    let lastRow = 7
    white.forEach((quota, i) => {
      if (i) {
        if (quota?.extraAdjustment > 0) {
          ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
          ws.cell(lastRow + i, 2).string("REAJUSTE").style(styles["quota"])
          ws.cell(lastRow + i, 3).string("").style(styles["quota"])
          ws.cell(lastRow + i, 4).number(quota?.extraAdjustment).style(styles["quota"])
          ws.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - 1, 3)} / 100`).style(styles["quota"])
          ws.cell(lastRow + i, 6).string("").style(styles["quota"])
          ws.cell(lastRow + i, 7).string("").style(styles["quota"])
          ws.cell(lastRow + i, 8).string("").style(styles["quota"])
          lastRow++
        }
        ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
        ws.cell(lastRow + i, 2).string("AJUSTE").style(styles["quota"])
        ws.cell(lastRow + i, 3).string("").style(styles["quota"])
        ws.cell(lastRow + i, 4).number(Number(quota?.adjustment)).style(styles["quota"])
        ws.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - (quota.extraAdjustment > 0 ? 2 : 1), 3)} / 100`).style(styles["quota"])
        ws.cell(lastRow + i, 6).string("").style(styles["quota"])
        ws.cell(lastRow + i, 7).string("").style(styles["quota"])
        ws.cell(lastRow + i, 8).string("").style(styles["quota"])
        lastRow++
      }
      ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
      ws.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
      ws.cell(lastRow + i, 3).formula(!i ? xl.getExcelCellRef(3, 11) + "/" + xl.getExcelCellRef(3, 12) : xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 8) + "+" + (quota.extraAdjustment > 0 ? xl.getExcelCellRef(lastRow - 2 + i, 5) : "") + "+" + xl.getExcelCellRef(lastRow - 1 + i, 5)).style(styles["quota"])
      ws.cell(lastRow + i, 4).number(quota?.cac || 0).style(styles["quota"])
      const totalCell = xl.getExcelCellRef(lastRow + i, 3)
      const cacCell = xl.getExcelCellRef(lastRow + i, 4)
      ws.cell(lastRow + i, 5).formula(`${totalCell} * ${cacCell} / 100`).style(styles["quota"])
      ws.cell(lastRow + i, 6).formula(`${totalCell} + ${xl.getExcelCellRef(lastRow + i, 5)}`).style(styles["quota"])
      ws.cell(lastRow + i, 7).string(quota?.date).style(styles["quota"])
      ws.cell(lastRow + i, 8).formula(`${xl.getExcelCellRef(lastRow + i, 6)}`).style(styles["quota"])
    })

    lastRow += white.length
    lastRow += 6

    lastRow = 5
    writeQuotasHeaders("B", lastRow, null, wsBlack)
    lastRow++

    black.forEach((quota, i) => {
      if (i) {
        if (quota?.extraAdjustment > 0) {
          wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
          wsBlack.cell(lastRow + i, 2).string("REAJUSTE").style(styles["quota"])
          wsBlack.cell(lastRow + i, 3).string("").style(styles["quota"])
          wsBlack.cell(lastRow + i, 4).number(quota?.extraAdjustment).style(styles["quota"])
          wsBlack.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - 1, 3)} / 100`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 6).string("").style(styles["quota"])
          wsBlack.cell(lastRow + i, 7).string("").style(styles["quota"])
          wsBlack.cell(lastRow + i, 8).string("").style(styles["quota"])
          lastRow++
        }
        wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
        wsBlack.cell(lastRow + i, 2).string("AJUSTE").style(styles["quota"])
        wsBlack.cell(lastRow + i, 3).string("").style(styles["quota"])
        wsBlack.cell(lastRow + i, 4).number(Number(quota?.adjustment)).style(styles["quota"])
        wsBlack.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - (quota.extraAdjustment > 0 ? 2 : 1), 3)} / 100`).style(styles["quota"])
        wsBlack.cell(lastRow + i, 6).string("").style(styles["quota"])
        wsBlack.cell(lastRow + i, 7).string("").style(styles["quota"])
        wsBlack.cell(lastRow + i, 8).string("").style(styles["quota"])
        lastRow++
      }

      wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
      wsBlack.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
      wsBlack.cell(lastRow + i, 3).formula(!i ? xl.getExcelCellRef(2, 3) + "/" + xl.getExcelCellRef(2, 4) : xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 8) + "+" + (quota.extraAdjustment > 0 ? xl.getExcelCellRef(lastRow - 2 + i, 5) : "") + "+" + xl.getExcelCellRef(lastRow - 1 + i, 5)).style(styles["quota"])
      wsBlack.cell(lastRow + i, 4).number(quota?.cac || 0).style(styles["quota"])
      const totalCell = xl.getExcelCellRef(lastRow + i, 3)
      const cacCell = xl.getExcelCellRef(lastRow + i, 4)
      wsBlack.cell(lastRow + i, 5).formula(`${totalCell} * ${cacCell} / 100`).style(styles["quota"])
      wsBlack.cell(lastRow + i, 6).formula(`${totalCell} + ${xl.getExcelCellRef(lastRow + i, 5)}`).style(styles["quota"])
      wsBlack.cell(lastRow + i, 7).string(quota?.date).style(styles["quota"])
      wsBlack.cell(lastRow + i, 8).formula(`${xl.getExcelCellRef(lastRow + i, 6)}`).style(styles["quota"])
    })
  }
  else {
    writeQuotasHeaders("A", 6, transaction?.white?.baseIndex)

    let lastRow = 7
    white.forEach((quota, i) => {
      ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
      ws.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
      ws.cell(lastRow + i, 3).formula(`K3 / L3`).style(styles["quota"])
      ws.cell(lastRow + i, 4).number(quota?.indexCac).style(styles["quota"])
      const totalCell = xl.getExcelCellRef(lastRow + i, 3)
      const baseIndexCell = xl.getExcelCellRef(3, 13)
      const cacCell = xl.getExcelCellRef(lastRow + i, 4)
      ws.cell(lastRow + i, 5).formula(`${cacCell} / ${baseIndexCell}% - 100`).style(styles["quota"])
      ws.cell(lastRow + i, 6).formula(`${xl.getExcelCellRef(lastRow + i, 5)} * ${totalCell}%`).style(styles["quota"])
      ws.cell(lastRow + i, 7).formula(`${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell}`).style(styles["quota"])
      ws.cell(lastRow + i, 8).string(quota?.date).style(styles["quota"])
      ws.cell(lastRow + i, 9).formula(`${xl.getExcelCellRef(lastRow + i, 7)}`).style(styles["quota"])
    })

    lastRow = 5

    writeQuotasHeaders("B", lastRow, transaction?.black?.baseIndex, wsBlack)
    lastRow++

    black.forEach((quota, i) => {
      wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
      wsBlack.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
      wsBlack.cell(lastRow + i, 3).formula(`C2 / D2`).style(styles["quota"])
      wsBlack.cell(lastRow + i, 4).number(quota?.indexCac).style(styles["quota"])
      const totalCell = xl.getExcelCellRef(lastRow + i, 3)
      const baseIndexCell = "'Sheet 1'!M3"
      const cacCell = xl.getExcelCellRef(lastRow + i, 4)
      wsBlack.cell(lastRow + i, 5).formula(`${cacCell} / ${baseIndexCell}% - 100`).style(styles["quota"])
      wsBlack.cell(lastRow + i, 6).formula(`${xl.getExcelCellRef(lastRow + i, 5)} * ${totalCell}%`).style(styles["quota"])
      wsBlack.cell(lastRow + i, 7).formula(`${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell}`).style(styles["quota"])
      wsBlack.cell(lastRow + i, 8).string(quota?.date).style(styles["quota"])
      wsBlack.cell(lastRow + i, 9).formula(`${xl.getExcelCellRef(lastRow + i, 7)}`).style(styles["quota"])
    })
  }

  return wb
}