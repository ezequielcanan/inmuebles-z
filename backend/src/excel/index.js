import xl from "excel4node"

const fontHeadStyle = {
  font: {
    size: 18,
    bold: true,
    color: "#FFFFFF"
  }
}

const textCenterStyle = {
  alignment: {
    horizontal: 'center',
    vertical: 'center',
    wrapText: true
  },

}

const boldBorder = {
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
  }
}

const thinBorder = {
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
  }
}

const bgHead = {
  fill: {
    type: "pattern",
    patternType: "solid",
    bgColor: "#516480",
    fgColor: "#516480"
  }
}

const bgSectionHead = {
  fill: {
    type: "pattern",
    patternType: "solid",
    bgColor: "#8497B0",
    fgColor: "#8497B0"
  }
}

const bgSectionInfo = {
  fill: {
    type: "pattern",
    patternType: "solid",
    bgColor: "#b7daf6",
    fgColor: "#b7daf6"
  }
}


export const createTransactionExcel = (transaction, quotas) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet()
  const wsBlack = wb.addWorksheet()

  const styles = {
    project: wb.createStyle({
      ...fontHeadStyle, ...textCenterStyle, ...boldBorder, ...bgHead
    }),

    apartmentInfoHead: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...boldBorder
    }),
    apartmentInfoCell: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder
    }),
    sectionHead: wb.createStyle({
      font: {
        size: 14,
        bold: true,
        color: "#FFFFFF"
      },
      ...textCenterStyle,
      ...boldBorder,
      ...bgSectionHead
    }),
    sectionInfoHead: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...boldBorder,
      ...bgSectionInfo
    }),
    quota: wb.createStyle({
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -'
    })
  }

  const { black, white } = quotas

  const { apartment } = transaction

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
  ws.column(14).setWidth(20);

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
  wsBlack.column(14).setWidth(20);


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

  ws.cell(2, 15).string("Precio dolar").style(styles["apartmentInfoHead"])
  ws.cell(3, 15).number(transaction?.dolar || 1).style(styles["apartmentInfoCell"])

  wsBlack.cell(1, 1).string("40%").style(styles["apartmentInfoHead"])
  wsBlack.cell(1, 2).string("Adelanto").style(styles["apartmentInfoHead"])
  wsBlack.cell(1, 3).string("Saldo").style(styles["apartmentInfoHead"])
  wsBlack.cell(1, 4).string("Cuotas").style(styles["apartmentInfoHead"])
  transaction?.black?.baseIndex && wsBlack.cell(1, 5).string("Indice base").style(styles["apartmentInfoHead"])

  ws.cell(3, 1).string(apartment?.unit).style(styles["apartmentInfoCell"])
  ws.cell(3, 2).number(apartment?.meters?.covered || 0).style(styles["apartmentInfoCell"])
  ws.cell(3, 3).number(apartment?.meters?.balcony || 0).style(styles["apartmentInfoCell"])
  ws.cell(3, 4).number(apartment?.meters?.uncovered || 0).style(styles["apartmentInfoCell"])
  ws.cell(3, 5).number(apartment?.meters?.amenities || 0).style(styles["apartmentInfoCell"])
  ws.cell(3, 6).number(apartment?.meters?.total || 0).style(styles["apartmentInfoCell"])
  ws.cell(3, 7).string(apartment?.rooms).style(styles["apartmentInfoCell"])
  ws.cell(3, 8).formula(`${transaction?.total || 0} * ${xl.getExcelCellRef(3, 15)}`).style(styles["apartmentInfoCell"])
  ws.cell(3, 9).formula(`${xl.getExcelCellRef(3, 8)} * 60%`).style(styles["apartmentInfoCell"])
  ws.cell(3, 10).formula(`${transaction?.booking} * ${xl.getExcelCellRef(3, 15)}`).style(styles["apartmentInfoCell"])
  ws.cell(3, 11).formula(`${xl.getExcelCellRef(3, 9)} - ${xl.getExcelCellRef(3, 10)}`).style(styles["apartmentInfoCell"])
  ws.cell(3, 12).number(transaction?.white?.quotas).style(styles["apartmentInfoCell"])

  wsBlack.cell(2, 1).formula(`'Sheet 1'!H3 * 40%`).style(styles["apartmentInfoCell"])
  wsBlack.cell(2, 2).formula(`${transaction?.bookingB} * 'Sheet 1'!O3`).style(styles["apartmentInfoCell"])
  wsBlack.cell(2, 3).formula(`${xl.getExcelCellRef(2, 1)} - ${xl.getExcelCellRef(2, 2)}`).style(styles["apartmentInfoCell"])
  wsBlack.cell(2, 4).number(transaction?.black?.quotas).style(styles["apartmentInfoCell"])
  transaction?.black?.baseIndex && wsBlack.cell(2, 5).number(transaction?.black?.baseIndex).style(styles["apartmentInfoCell"])

  const writeQuotasHeaders = (type, row, index, sheet = ws, dollar = false) => {
    sheet.cell(row - 1, 1, row - 1, !dollar ? (index ? 13 : 12) : 9, true).string(type).style(!dollar ? styles["sectionHead"] : { ...styles["sectionHead"], fill: { type: "pattern", patternType: "solid", bgColor: "#64ff33", fgColor: "#64ff33" }, font: { size: 14, bold: true, color: "#000000" } })
    const addRowIfIndex = index ? 1 : 0
    sheet.cell(row, 1).string("Nombre").style(styles["sectionInfoHead"])
    sheet.cell(row, 2).string("N° Cuota").style(styles["sectionInfoHead"])
    sheet.cell(row, 3).string("Cuota").style(styles["sectionInfoHead"])
    if (!dollar) {
      index && sheet.cell(row, 4).string("Indice").style(styles["sectionInfoHead"])
      sheet.cell(row, 4 + addRowIfIndex).string("Porcentaje").style(styles["sectionInfoHead"])
      sheet.cell(row, 5 + addRowIfIndex).string("Ajuste").style(styles["sectionInfoHead"])
      sheet.cell(row, 6 + addRowIfIndex).string("Cuota actual").style(styles["sectionInfoHead"])
      sheet.cell(row, 7 + addRowIfIndex).string("Fecha").style(styles["sectionInfoHead"])
      sheet.cell(row, 8 + addRowIfIndex).string("Total Abonado").style(styles["sectionInfoHead"])
      sheet.cell(row, 9 + addRowIfIndex).string("Saldo a favor").style(styles["sectionInfoHead"])
      sheet.cell(row, 10 + addRowIfIndex).string("Interes").style(styles["sectionInfoHead"])
      sheet.cell(row, 11 + addRowIfIndex).string("Valor dolar").style(styles["sectionInfoHead"])
      sheet.cell(row, 12 + addRowIfIndex).string("Equivalente en dolares").style(styles["sectionInfoHead"])
    } else {
      sheet.cell(row, 4).string("Cuota actual").style(styles["sectionInfoHead"])
      sheet.cell(row, 5).string("Fecha").style(styles["sectionInfoHead"])
      sheet.cell(row, 6).string("Total Abonado").style(styles["sectionInfoHead"])
      sheet.cell(row, 7).string("Saldo a favor").style(styles["sectionInfoHead"])
      sheet.cell(row, 8).string("Interes").style(styles["sectionInfoHead"])
      index ? sheet.cell(row, 9).string("Indice CAC").style(styles["sectionInfoHead"]) : sheet.cell(row, 9).string("CAC %").style(styles["sectionInfoHead"])
    }
  }

  if (!transaction?.white?.baseIndex) { // FORMATO PORCENTAJES --------------------------------------------------------------------------

    let lastQuota
    let adjustmentRows = 0
    let lastRow = 7
    let lastMode = ""
    const lastPesosQuotas = []
    const lastDollarQuotas = []

    white.forEach((quota, i) => {

      if (quota.paidUSD == null || quota.paid) {
        if (lastMode != "pesos") {
          writeQuotasHeaders("A", lastRow + i + 2, transaction?.white?.baseIndex)
          lastMode.length && ws.cell(lastRow + i + 2, 10).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

          const currencyChangeDifference = lastDollarQuotas.reduce((acc, dollarQuota, i) => {
            const updatedPaid = dollarQuota?.paidUSD * dollarQuota?.dollarPrice
            const quotaAfterAdjustment = i ? dollarQuota?.total + (lastDollarQuotas[i - 1].total * dollarQuota?.adjustment / 100) : dollarQuota?.total
            const updatedQuota = (quotaAfterAdjustment + (quotaAfterAdjustment * dollarQuota?.cac / 100)) * dollarQuota?.dollarPrice

            return acc + (updatedQuota - updatedPaid)
          }, 0)

          const quotaAfterAdjustment = lastDollarQuotas.reduce((acc, dollarQuota, i) => {
            const quotaAfterAdjustment = i ? dollarQuota?.total + (lastDollarQuotas[i - 1].total * dollarQuota?.adjustment / 100) : dollarQuota?.total
            return quotaAfterAdjustment
          }, 0)


          const updatedQuota = lastDollarQuotas.reduce((acc, dollarQuota, i) => {
            const quotaAfterAdjustment = i ? dollarQuota?.total + (lastDollarQuotas[i - 1].total * dollarQuota?.adjustment / 100) : dollarQuota?.total
            const updatedQuota = (quotaAfterAdjustment + (quotaAfterAdjustment * dollarQuota?.cac / 100))
            return updatedQuota
          }, 0)

          const totalWithAdjustment = ((quotaAfterAdjustment || transaction?.white?.baseQuota) * (Number(quota.adjustment || 0) + Number(quota.extraAdjustment || 0)) / 100) + updatedQuota + (currencyChangeDifference > 0 ? (currencyChangeDifference / transaction.dolar) * (Number(quota.adjustment || 0) + Number(quota.extraAdjustment || 0)) / 100 + (currencyChangeDifference / transaction.dolar) : 0)


          console.log(currencyChangeDifference, quotaAfterAdjustment, updatedQuota, totalWithAdjustment)
          ws.cell(lastRow + i + 3, 14).number(currencyChangeDifference).style(styles["quota"])
          ws.cell(lastRow + i + 3, 6).formula(`IF(${xl.getExcelCellRef(lastRow + i + 3, 14)} > 0, ${xl.getExcelCellRef(lastRow + i + 3, 5)} + ${xl.getExcelCellRef(lastRow + i + 3, 3)}, ${xl.getExcelCellRef(lastRow + i + 3, 5)} + ${xl.getExcelCellRef(lastRow + i + 3, 3)} + ${xl.getExcelCellRef(lastRow + i + 3, 14)})`).style(styles["quota"])
          ws.cell(lastRow + i + 3, 3).number(totalWithAdjustment * transaction.dolar).style(styles["quota"])

          lastRow += 3
          lastDollarQuotas.length = 0
        }

        if (i && lastMode == "pesos") {
          if (quota?.extraAdjustment > 0 && lastMode == "pesos") {
            ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
            ws.cell(lastRow + i, 2).string("REAJUSTE").style(styles["quota"])
            ws.cell(lastRow + i, 3).string("").style(styles["quota"])
            ws.cell(lastRow + i, 4).number(quota?.extraAdjustment).style(styles["quota"])
            ws.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - 1, 3)} / 100`).style(styles["quota"])
            ws.cell(lastRow + i, 6).string("").style(styles["quota"])
            ws.cell(lastRow + i, 7).string("").style(styles["quota"])
            ws.cell(lastRow + i, 8).string("").style(styles["quota"])
            adjustmentRows++
            lastRow++
          }
          ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
          ws.cell(lastRow + i, 2).string("AJUSTE").style(styles["quota"])
          ws.cell(lastRow + i, 3).string("").style(styles["quota"])
          ws.cell(lastRow + i, 4).number(Number(quota?.adjustment || 0)).style(styles["quota"])
          ws.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - (quota.extraAdjustment > 0 ? 2 : 1), 3)} / 100`).style(styles["quota"])
          ws.cell(lastRow + i, 6).string("").style(styles["quota"])
          ws.cell(lastRow + i, 7).string("").style(styles["quota"])
          ws.cell(lastRow + i, 8).string("").style(styles["quota"])
          adjustmentRows++
          lastRow++
        }
        ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
        ws.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
        ws.cell(lastRow + i, 7).string(quota?.date || "").style(styles["quota"])
        if (quota.paid != null) {
          lastQuota = quota
          lastMode == "" && ws.cell(lastRow + i, 3).formula("K3/L3").style(styles["quota"])
          lastMode == "pesos" && ws.cell(lastRow + i, 3).formula(!i ? xl.getExcelCellRef(3, 11) + "/" + xl.getExcelCellRef(3, 12) : `${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 6)} + ${(quota.extraAdjustment > 0 ? xl.getExcelCellRef(lastRow - 2 + i, 5) : "")} + ${xl.getExcelCellRef(lastRow - 1 + i, 5)} + IF(${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)} > 0, ${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)} * (${(quota.extraAdjustment > 0 ? xl.getExcelCellRef(lastRow - 2 + i, 4) + "+" + xl.getExcelCellRef(lastRow - 1 + i, 4) : xl.getExcelCellRef(lastRow - 1 + i, 4))})% + ${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)}, 0)`).style(styles["quota"])
          ws.cell(lastRow + i, 4).number(quota?.cac || 0).style(styles["quota"])
          const totalCell = xl.getExcelCellRef(lastRow + i, 3)
          const cacCell = xl.getExcelCellRef(lastRow + i, 4)
          ws.cell(lastRow + i, 5).formula(`${totalCell} * ${cacCell} / 100`).style(styles["quota"])
          lastMode == "pesos" && ws.cell(lastRow + i, 6).formula(lastMode == "pesos" ? `IF(${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)} >= 0, ${totalCell} + ${xl.getExcelCellRef(lastRow + i, 5)}, ${totalCell} + ${xl.getExcelCellRef(lastRow + i, 5)} + ${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)})` : `${xl.getExcelCellRef(lastRow + i, 3)} + ${xl.getExcelCellRef(lastRow + i, 5)} + ${xl.getExcelCellRef(lastRow + i - adjustmentRows, 14)}`).style(styles["quota"])
          ws.cell(lastRow + i, 8).formula(`${quota?.paid || 0} * ${xl.getExcelCellRef(3, 15)}`).style(styles["quota"])
          ws.cell(lastRow + i, 9).formula(`${xl.getExcelCellRef(lastRow + i, 6)} - ${xl.getExcelCellRef(lastRow + i, 8)}`).style(styles["quota"])
          ws.cell(lastRow + i, 10).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 6)}%`).style(styles["quota"])
          ws.cell(lastRow + i, 11).number(quota?.dollarPrice || 0).style(styles["quota"])
          ws.cell(lastRow + i, 12).formula(`${xl.getExcelCellRef(lastRow + i, 8)} / ${xl.getExcelCellRef(lastRow + i, 11)}`).style(styles["quota"])
        }



        lastMode = "pesos"
        lastQuota = quota
        lastPesosQuotas.push(quota)
      }
      else {
        if (lastMode != "dollar") {
          writeQuotasHeaders("A", lastRow + i + 2, transaction?.white?.baseIndex, ws, true)
          lastMode.length && ws.cell(lastRow + i + 2, 10).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

          const currencyChangeDifference = `-(SUM(${xl.getExcelCellRef(lastRow + i - lastPesosQuotas.length - adjustmentRows, 12)}:${xl.getExcelCellRef(lastRow + i - 1, 12)}) - ${lastPesosQuotas.length} * K3 / L3 / O3)`
          ws.cell(lastRow + i + 3, 10).formula(currencyChangeDifference).style(styles["quota"])
          ws.cell(lastRow + i + 3, 4).formula(`${xl.getExcelCellRef(lastRow + i + 3, 3)} + ${xl.getExcelCellRef(lastRow + i + 3, 10)}`).style(styles["quota"])

          lastRow += 3
          lastPesosQuotas.length = 0
          adjustmentRows = 0
        }

        lastQuota = quota
        lastDollarQuotas.push(quota)

        ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
        ws.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
        ws.cell(lastRow + i, 3).formula("K3 / L3 / O3").style(styles["quota"])
        lastMode == "dollar" && ws.cell(lastRow + i, 4).formula(`${xl.getExcelCellRef(lastRow + i, 3)}+${xl.getExcelCellRef(lastRow + i - 1, 7)}`).style(styles["quota"])
        ws.cell(lastRow + i, 5).string(quota?.date || "").style(styles["quota"])
        ws.cell(lastRow + i, 6).formula(`${quota?.paidUSD || 0}`).style(styles["quota"])
        ws.cell(lastRow + i, 7).formula(`${xl.getExcelCellRef(lastRow + i, 4)} - ${xl.getExcelCellRef(lastRow + i, 6)}`).style(styles["quota"])
        ws.cell(lastRow + i, 8).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 4)}%`).style(styles["quota"])
        ws.cell(lastRow + i, 9).number(quota?.cac || 0).style(styles["quota"])

        lastMode = "dollar"
      }
    })

    lastRow += white.length
    lastRow += 6

    lastRow = 5

    if (xl.getExcelCellRef(2, 1) - xl.getExcelCellRef(2, 2) != 0) {
      let lastMode = ""
      lastDollarQuotas.length = 0
      lastPesosQuotas.length = 0
      black.forEach((quota, i) => {

        if (quota.paidUSD == null || quota.paid) {
          if (lastMode != "pesos") {
            writeQuotasHeaders("B", lastRow + i + 2, transaction?.black?.baseIndex, wsBlack)
            lastMode.length && wsBlack.cell(lastRow + i + 2, 10).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

            const currencyChangeDifference = lastDollarQuotas.reduce((acc, dollarQuota, i) => {
              const updatedPaid = dollarQuota?.paidUSD * dollarQuota?.dollarPrice
              const quotaAfterAdjustment = i ? dollarQuota?.total + (lastDollarQuotas[i - 1].total * dollarQuota?.adjustment / 100) : dollarQuota?.total
              const updatedQuota = (quotaAfterAdjustment + (quotaAfterAdjustment * dollarQuota?.cac / 100)) * dollarQuota?.dollarPrice
              return acc + (updatedQuota - updatedPaid)
            }, 0)

            const quotaAfterAdjustment = lastDollarQuotas.reduce((acc, dollarQuota, i) => {
              const quotaAfterAdjustment = i ? dollarQuota?.total + (lastDollarQuotas[i - 1].total * dollarQuota?.adjustment / 100) : dollarQuota?.total
              return quotaAfterAdjustment
            }, 0)

            const updatedQuota = lastDollarQuotas.reduce((acc, dollarQuota, i) => {
              const quotaAfterAdjustment = i ? dollarQuota?.total + (lastDollarQuotas[i - 1].total * dollarQuota?.adjustment / 100) : dollarQuota?.total
              const updatedQuota = (quotaAfterAdjustment + (quotaAfterAdjustment * dollarQuota?.cac / 100))
              return updatedQuota
            }, 0)

            const totalWithAdjustment = ((quotaAfterAdjustment || transaction?.black?.baseQuota) * (Number(quota.adjustment || 0) + Number(quota.extraAdjustment || 0)) / 100) + updatedQuota + (currencyChangeDifference > 0 ? (currencyChangeDifference / transaction.dolar) * (Number(quota.adjustment || 0) + Number(quota.extraAdjustment || 0)) / 100 + (currencyChangeDifference / transaction.dolar) : 0)

            wsBlack.cell(lastRow + i + 3, 14).number(currencyChangeDifference || 0).style(styles["quota"])
            wsBlack.cell(lastRow + i + 3, 6).formula(`IF(${xl.getExcelCellRef(lastRow + i + 3, 14)} > 0, ${xl.getExcelCellRef(lastRow + i + 3, 5)} + ${xl.getExcelCellRef(lastRow + i + 3, 3)}, ${xl.getExcelCellRef(lastRow + i + 3, 5)} + ${xl.getExcelCellRef(lastRow + i + 3, 3)} + ${xl.getExcelCellRef(lastRow + i + 3, 14)})`).style(styles["quota"])
            wsBlack.cell(lastRow + i + 3, 3).number(totalWithAdjustment * transaction.dolar).style(styles["quota"])

            lastRow += 3
            lastDollarQuotas.length = 0
          }

          if (i && lastMode == "pesos") {
            if (quota?.extraAdjustment > 0 && lastMode == "pesos") {
              wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
              wsBlack.cell(lastRow + i, 2).string("REAJUSTE").style(styles["quota"])
              wsBlack.cell(lastRow + i, 3).string("").style(styles["quota"])
              wsBlack.cell(lastRow + i, 4).number(quota?.extraAdjustment).style(styles["quota"])
              wsBlack.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - 1, 3)} / 100`).style(styles["quota"])
              wsBlack.cell(lastRow + i, 6).string("").style(styles["quota"])
              wsBlack.cell(lastRow + i, 7).string("").style(styles["quota"])
              ws.cell(lastRow + i, 8).string("").style(styles["quota"])
              adjustmentRows++
              lastRow++
            }
            wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
            wsBlack.cell(lastRow + i, 2).string("AJUSTE").style(styles["quota"])
            wsBlack.cell(lastRow + i, 3).string("").style(styles["quota"])
            wsBlack.cell(lastRow + i, 4).number(Number(quota?.adjustment || 0)).style(styles["quota"])
            wsBlack.cell(lastRow + i, 5).formula(`${xl.getExcelCellRef(lastRow + i, 4)} * ${xl.getExcelCellRef(lastRow + i - (quota.extraAdjustment > 0 ? 2 : 1), 3)} / 100`).style(styles["quota"])
            wsBlack.cell(lastRow + i, 6).string("").style(styles["quota"])
            wsBlack.cell(lastRow + i, 7).string("").style(styles["quota"])
            wsBlack.cell(lastRow + i, 8).string("").style(styles["quota"])
            adjustmentRows++
            lastRow++
          }
          wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
          wsBlack.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
          wsBlack.cell(lastRow + i, 7).string(quota?.date || "").style(styles["quota"])
          if (quota.paid != null) {
            lastQuota = quota
            lastMode == "" && wsBlack.cell(lastRow + i, 3).formula("C2/D2").style(styles["quota"])
            lastMode == "pesos" && wsBlack.cell(lastRow + i, 3).formula(!i ? "C2" + "/" + "D2" : `${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 6)} + ${(quota.extraAdjustment > 0 ? xl.getExcelCellRef(lastRow - 2 + i, 5) : "")} + ${xl.getExcelCellRef(lastRow - 1 + i, 5)} + IF(${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)} > 0, ${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)} * (${(quota.extraAdjustment > 0 ? xl.getExcelCellRef(lastRow - 2 + i, 4) + "+" + xl.getExcelCellRef(lastRow - 1 + i, 4) : xl.getExcelCellRef(lastRow - 1 + i, 4))})% + ${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)}, 0)`).style(styles["quota"])
            wsBlack.cell(lastRow + i, 4).number(quota?.cac || 0).style(styles["quota"])
            const totalCell = xl.getExcelCellRef(lastRow + i, 3)
            const cacCell = xl.getExcelCellRef(lastRow + i, 4)
            wsBlack.cell(lastRow + i, 5).formula(`${totalCell} * ${cacCell} / 100`).style(styles["quota"])
            lastMode == "pesos" && wsBlack.cell(lastRow + i, 6).formula(lastMode == "pesos" ? `IF(${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)} >= 0, ${totalCell} + ${xl.getExcelCellRef(lastRow + i, 5)}, ${totalCell} + ${xl.getExcelCellRef(lastRow + i, 5)} + ${xl.getExcelCellRef(lastRow - (quota.extraAdjustment > 0 ? 3 : 2) + i, 9)})` : `${xl.getExcelCellRef(lastRow + i, 3)} + ${xl.getExcelCellRef(lastRow + i, 5)} + ${xl.getExcelCellRef(lastRow + i - adjustmentRows, 14)}`).style(styles["quota"])
            wsBlack.cell(lastRow + i, 8).formula(`${quota?.paid || 0} * 'Sheet 1'!O3`).style(styles["quota"])
            wsBlack.cell(lastRow + i, 9).formula(`${xl.getExcelCellRef(lastRow + i, 6)} - ${xl.getExcelCellRef(lastRow + i, 8)}`).style(styles["quota"])
            wsBlack.cell(lastRow + i, 10).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 6)}%`).style(styles["quota"])
            wsBlack.cell(lastRow + i, 11).number(quota?.dollarPrice || 0).style(styles["quota"])
            wsBlack.cell(lastRow + i, 12).formula(`${xl.getExcelCellRef(lastRow + i, 8)} / ${xl.getExcelCellRef(lastRow + i, 11)}`).style(styles["quota"])
          }



          lastMode = "pesos"
          lastQuota = quota
          lastPesosQuotas.push(quota)
        }
        else {
          if (lastMode != "dollar") {
            writeQuotasHeaders("B", lastRow + i + 2, transaction?.black?.baseIndex, wsBlack, true)
            lastMode.length && wsBlack.cell(lastRow + i + 2, 10).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

            const currencyChangeDifference = `-(SUM(${xl.getExcelCellRef(lastRow + i - lastPesosQuotas.length - adjustmentRows, 12)}:${xl.getExcelCellRef(lastRow + i - 1, 12)}) - ${lastPesosQuotas.length} * C2 / D2 / 'Sheet 1'!O3)`
            wsBlack.cell(lastRow + i + 3, 10).formula(currencyChangeDifference).style(styles["quota"])
            wsBlack.cell(lastRow + i + 3, 4).formula(`${xl.getExcelCellRef(lastRow + i + 3, 3)} + ${xl.getExcelCellRef(lastRow + i + 3, 10)}`).style(styles["quota"])

            lastRow += 3
            lastPesosQuotas.length = 0
            adjustmentRows = 0
          }

          lastQuota = quota
          lastDollarQuotas.push(quota)

          wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
          wsBlack.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
          wsBlack.cell(lastRow + i, 3).formula("C2 / D2 / 'Sheet 1'!O3").style(styles["quota"])
          lastMode == "dollar" && wsBlack.cell(lastRow + i, 4).formula(`${xl.getExcelCellRef(lastRow + i, 3)}+${xl.getExcelCellRef(lastRow + i - 1, 7)}`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 5).string(quota?.date || "").style(styles["quota"])
          wsBlack.cell(lastRow + i, 6).formula(`${quota?.paidUSD || 0}`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 7).formula(`${xl.getExcelCellRef(lastRow + i, 4)} - ${xl.getExcelCellRef(lastRow + i, 6)}`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 8).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 4)}%`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 9).number(quota?.cac || 0).style(styles["quota"])

          lastMode = "dollar"
        }
      })
    }
  }
  else { // FORMATO COEFICIENTE --------------------------------------------------------------------------------------------------------

    let lastQuota
    let lastRow = 7
    let lastMode = ""
    const lastPesosQuotas = []
    const lastDollarQuotas = []

    white.forEach((quota, i) => {
      if (quota.paidUSD == null || quota.paid) {
        const totalAfterDollarQuotas = lastQuota?.paidUSD ? lastDollarQuotas.reduce((acc, dollarQuota) => {
          const quotaInPesos = dollarQuota?.total * dollarQuota?.dollarPrice
          const total = quotaInPesos + quotaInPesos * (dollarQuota?.indexCac / transaction?.white?.baseIndex * 100 - 100)
          return total
        }, 0) : null

        let currencyChangeDifference = 0
        if (lastMode != "pesos") {
          writeQuotasHeaders("A", lastRow + i + 2, transaction?.white?.baseIndex)
          lastMode.length && ws.cell(lastRow + i + 2, 14).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

          currencyChangeDifference = lastDollarQuotas.reduce((acc, dollarQuota) => {
            const updatedPaid = dollarQuota?.paidUSD * dollarQuota?.dollarPrice
            const updatedQuota = dollarQuota?.total * dollarQuota?.dollarPrice + (dollarQuota?.indexCac != transaction?.white?.baseIndex ? ((dollarQuota?.total * dollarQuota?.dollarPrice * (dollarQuota?.indexCac / transaction?.white?.baseIndex * 100 - 100)) / 100) : 0)
            return acc + (updatedQuota - updatedPaid)
          }, 0)

          lastMode.length && ws.cell(lastRow + i + 3, 14).number(currencyChangeDifference).style(styles["quota"])
          lastRow += 3
          lastDollarQuotas.length = 0
        }

        lastQuota = quota
        lastPesosQuotas.push(quota)

        const totalCell = xl.getExcelCellRef(lastRow + i, 3)
        const baseIndexCell = xl.getExcelCellRef(3, 13)
        const cacCell = xl.getExcelCellRef(lastRow + i, 4)
        ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
        ws.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
        ws.cell(lastRow + i, 3).formula(currencyChangeDifference > 0 ? `K3 / L3 + ${xl.getExcelCellRef(lastRow + i, 14)}` : ((!i || lastMode != "pesos") ? `K3 / L3` : `IF(${xl.getExcelCellRef(lastRow + i - 1, 10)} >= 0, K3 / L3 + ${xl.getExcelCellRef(lastRow + i - 1, 10)}, K3 / L3)`)).style(styles["quota"])
        ws.cell(lastRow + i, 4).number(quota?.indexCac || 0).style(styles["quota"])
        ws.cell(lastRow + i, 5).formula(`${cacCell} / ${baseIndexCell}% - 100`).style(styles["quota"])
        ws.cell(lastRow + i, 6).formula(`${xl.getExcelCellRef(lastRow + i, 5)} * ${totalCell}%`).style(styles["quota"])
        ws.cell(lastRow + i, 7).formula(currencyChangeDifference < 0 ? `${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell} + ${xl.getExcelCellRef(lastRow + i, 14)}` : (!i || lastMode != "pesos") ? `${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell}` : `IF(${xl.getExcelCellRef(lastRow + i - 1, 10)} >= 0, ${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell}, ${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell} + ${xl.getExcelCellRef(lastRow + i - 1, 10)})`).style(styles["quota"])
        ws.cell(lastRow + i, 8).string(quota?.date || "").style(styles["quota"])
        ws.cell(lastRow + i, 9).formula(`${quota?.paid || 0} * ${xl.getExcelCellRef(3, 15)}`).style(styles["quota"])
        ws.cell(lastRow + i, 10).formula(`${xl.getExcelCellRef(lastRow + i, 7)} - ${xl.getExcelCellRef(lastRow + i, 9)}`).style(styles["quota"])
        ws.cell(lastRow + i, 11).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 7)}%`).style(styles["quota"])
        ws.cell(lastRow + i, 12).number(quota?.dollarPrice).style(styles["quota"])
        ws.cell(lastRow + i, 13).formula(`${xl.getExcelCellRef(lastRow + i, 9)} / ${xl.getExcelCellRef(lastRow + i, 12)}`).style(styles["quota"])
        lastMode = "pesos"
      } else {
        if (lastMode != "dollar") {
          writeQuotasHeaders("A", lastRow + i + 2, transaction?.white?.baseIndex, ws, true)
          lastMode.length && ws.cell(lastRow + i + 2, 10).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

          const currencyChangeDifference = `-(SUM(${xl.getExcelCellRef(lastRow + i - lastPesosQuotas.length, 13)}:${xl.getExcelCellRef(lastRow + i - 1, 13)}) - ${lastPesosQuotas.length} * K3 / L3 / O3)`
          ws.cell(lastRow + i + 3, 10).formula(currencyChangeDifference).style(styles["quota"])
          ws.cell(lastRow + i + 3, 4).formula(`${xl.getExcelCellRef(lastRow + i + 3, 3)} + ${xl.getExcelCellRef(lastRow + i + 3, 10)}`).style(styles["quota"])

          lastRow += 3
          lastPesosQuotas.length = 0
        }

        lastQuota = quota
        lastDollarQuotas.push(quota)

        ws.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
        ws.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
        ws.cell(lastRow + i, 3).formula("K3 / L3 / O3").style(styles["quota"])
        lastMode == "dollar" && ws.cell(lastRow + i, 4).formula(`${xl.getExcelCellRef(lastRow + i, 3)}+${xl.getExcelCellRef(lastRow + i - 1, 7)}`).style(styles["quota"])
        ws.cell(lastRow + i, 5).string(quota?.date || "").style(styles["quota"])
        ws.cell(lastRow + i, 6).formula(`${quota?.paidUSD || 0}`).style(styles["quota"])
        ws.cell(lastRow + i, 7).formula(`${xl.getExcelCellRef(lastRow + i, 4)} - ${xl.getExcelCellRef(lastRow + i, 6)}`).style(styles["quota"])
        ws.cell(lastRow + i, 8).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 4)}%`).style(styles["quota"])
        ws.cell(lastRow + i, 9).number(quota?.indexCac || 0).style(styles["quota"])

        lastMode = "dollar"
      }

    })

    lastRow = 5

    if (xl.getExcelCellRef(2, 1) - xl.getExcelCellRef(2, 2) != 0) {
      lastDollarQuotas.length = 0
      lastPesosQuotas.length = 0
      lastMode = ""
      black.forEach((quota, i) => {
        if (quota.paidUSD == null || quota.paid) {
          const totalAfterDollarQuotas = lastQuota?.paidUSD ? lastDollarQuotas.reduce((acc, dollarQuota) => {
            const quotaInPesos = dollarQuota?.total * dollarQuota?.dollarPrice
            const total = quotaInPesos + quotaInPesos * (dollarQuota?.indexCac / transaction?.black?.baseIndex * 100 - 100)
            return total
          }, 0) : null

          let currencyChangeDifference = 0
          if (lastMode != "pesos") {
            writeQuotasHeaders("B", lastRow + i + 2, transaction?.black?.baseIndex, wsBlack)
            lastMode.length && wsBlack.cell(lastRow + i + 2, 14).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

            currencyChangeDifference = lastDollarQuotas.reduce((acc, dollarQuota) => {
              const updatedPaid = dollarQuota?.paidUSD * dollarQuota?.dollarPrice
              const updatedQuota = dollarQuota?.total * dollarQuota?.dollarPrice + (dollarQuota?.indexCac != transaction?.black?.baseIndex ? ((dollarQuota?.total * dollarQuota?.dollarPrice * (dollarQuota?.indexCac / transaction?.black?.baseIndex * 100 - 100)) / 100) : 0)
              return acc + (updatedQuota - updatedPaid)
            }, 0)

            lastMode.length && wsBlack.cell(lastRow + i + 3, 14).number(currencyChangeDifference).style(styles["quota"])
            lastRow += 3
            lastDollarQuotas.length = 0
          }

          lastQuota = quota
          lastPesosQuotas.push(quota)

          const totalCell = xl.getExcelCellRef(lastRow + i, 3)
          const baseIndexCell = "'Sheet 1'!M3"
          const cacCell = xl.getExcelCellRef(lastRow + i, 4)
          wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
          wsBlack.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
          wsBlack.cell(lastRow + i, 3).formula(currencyChangeDifference > 0 ? `C2 / D2 + ${xl.getExcelCellRef(lastRow + i, 14)}` : ((!i || lastMode != "pesos") ? `C2 / D2` : `IF(${xl.getExcelCellRef(lastRow + i - 1, 10)} >= 0, C2 / D2 + ${xl.getExcelCellRef(lastRow + i - 1, 10)}, C2 / D2)`)).style(styles["quota"])
          wsBlack.cell(lastRow + i, 4).number(quota?.indexCac || 0).style(styles["quota"])
          wsBlack.cell(lastRow + i, 5).formula(`${cacCell} / ${baseIndexCell}% - 100`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 6).formula(`${xl.getExcelCellRef(lastRow + i, 5)} * ${totalCell}%`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 7).formula(currencyChangeDifference < 0 ? `${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell} + ${xl.getExcelCellRef(lastRow + i, 14)}` : (!i || lastMode != "pesos") ? `${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell}` : `IF(${xl.getExcelCellRef(lastRow + i - 1, 10)} >= 0, ${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell}, ${xl.getExcelCellRef(lastRow + i, 6)} + ${totalCell} + ${xl.getExcelCellRef(lastRow + i - 1, 10)})`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 8).string(quota?.date || "").style(styles["quota"])
          wsBlack.cell(lastRow + i, 9).formula(`${quota?.paid || 0} * 'Sheet 1'!O3`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 10).formula(`${xl.getExcelCellRef(lastRow + i, 7)} - ${xl.getExcelCellRef(lastRow + i, 9)}`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 11).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 7)}%`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 12).number(quota?.dollarPrice).style(styles["quota"])
          wsBlack.cell(lastRow + i, 13).formula(`${xl.getExcelCellRef(lastRow + i, 9)} / ${xl.getExcelCellRef(lastRow + i, 12)}`).style(styles["quota"])
          lastMode = "pesos"
        } else {
          if (lastMode != "dollar") {
            writeQuotasHeaders("B", lastRow + i + 2, transaction?.black?.baseIndex, wsBlack, true)
            lastMode.length && wsBlack.cell(lastRow + i + 2, 10).string("Saldo cambio de moneda").style(styles["sectionInfoHead"])

            const currencyChangeDifference = `-(SUM(${xl.getExcelCellRef(lastRow + i - lastPesosQuotas.length, 13)}:${xl.getExcelCellRef(lastRow + i - 1, 13)}) - ${lastPesosQuotas.length} * C2 / D2 / 'Sheet 1'!O3)`
            wsBlack.cell(lastRow + i + 3, 10).formula(currencyChangeDifference).style(styles["quota"])
            wsBlack.cell(lastRow + i + 3, 4).formula(`${xl.getExcelCellRef(lastRow + i + 3, 3)} + ${xl.getExcelCellRef(lastRow + i + 3, 10)}`).style(styles["quota"])

            lastRow += 3
            lastPesosQuotas.length = 0
          }

          lastQuota = quota
          lastDollarQuotas.push(quota)

          wsBlack.cell(lastRow + i, 1).string(quota?.transaction?.buyer?.name).style(styles["quota"])
          wsBlack.cell(lastRow + i, 2).number(quota?.quota).style({ ...styles["quota"], numberFormat: "#; -#; -" })
          wsBlack.cell(lastRow + i, 3).formula("C2 / D2 / 'Sheet 1'!O3").style(styles["quota"])
          lastMode == "dollar" && wsBlack.cell(lastRow + i, 4).formula(`${xl.getExcelCellRef(lastRow + i, 3)}+${xl.getExcelCellRef(lastRow + i - 1, 7)}`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 5).string(quota?.date || "").style(styles["quota"])
          wsBlack.cell(lastRow + i, 6).formula(`${quota?.paidUSD || 0}`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 7).formula(`${xl.getExcelCellRef(lastRow + i, 4)} - ${xl.getExcelCellRef(lastRow + i, 6)}`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 8).formula(`${quota?.interest || 0} * ${xl.getExcelCellRef(lastRow + i, 4)}%`).style(styles["quota"])
          wsBlack.cell(lastRow + i, 9).number(quota?.indexCac || 0).style(styles["quota"])

          lastMode = "dollar"
        }

      })
    }
  }

  return wb
}


export const createProjectExcel = (floors, project, transactions) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet(project.title, {
    sheetFormat: {
      'defaultColWidth': 20,
      'defaultRowHeight': 30,
    }
  })

  const styles = {
    project: wb.createStyle({
      ...fontHeadStyle, ...textCenterStyle, ...boldBorder, ...bgHead
    }),

    floorInfoHead: wb.createStyle({
      font: {
        bold: true,
        size: 16
      },
      ...textCenterStyle,
      ...boldBorder,
      alignment: {
        wrapText: true,
        textRotation: 90,
        vertical: 'center',
      }
    }),
    floorInfoCell: wb.createStyle({
      font: {
        bold: true,
        size: 14
      },
      ...textCenterStyle,
      ...thinBorder
    }),
    sectionHead: wb.createStyle({
      font: {
        size: 14,
        bold: true,
        color: "#FFFFFF"
      },
      ...textCenterStyle,
      ...boldBorder,
      ...bgSectionHead
    }),
    sectionInfoHead: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...boldBorder,
      ...bgSectionInfo
    })
  }

  ws.cell(1, 1, 1, 30, true).string(project.title).style(styles["project"])

  ws.cell(2, 2, 2, 12, true).string("Frente").style(styles["sectionHead"])
  ws.cell(2, 21, 2, 31, true).string("Contrafrente").style(styles["sectionHead"])

  const writeApartmentsHeaders = (col = 2, row = 3) => {
    ws.cell(row, col).string("ESTADO").style({ ...styles["sectionInfoHead"], fill: { type: "pattern", patternType: "solid", bgColor: "#ffff00", fgColor: "#ffff00" } })
    ws.cell(row, col + 1).string("UF").style(styles["sectionInfoHead"])
    ws.cell(row, col + 2).string("M2 Cubiertos").style(styles["sectionInfoHead"])
    ws.cell(row, col + 3).string("M2 Balcon").style(styles["sectionInfoHead"])
    ws.cell(row, col + 4).string("M2 Descubiertos").style(styles["sectionInfoHead"])
    ws.cell(row, col + 5).string("Amenities").style(styles["sectionInfoHead"])
    ws.cell(row, col + 6).string("Total M2").style(styles["sectionInfoHead"])
    ws.cell(row, col + 7).string("Precio M2").style(styles["sectionInfoHead"])
    ws.cell(row, col + 8).string("Precio total").style(styles["sectionInfoHead"])
    ws.cell(row, col + 9).string("Ambientes").style(styles["sectionInfoHead"])
    ws.cell(row, col + 10).string("Dueño").style(styles["sectionInfoHead"])
    ws.cell(row, col + 11).string("Vendido a:").style(styles["sectionInfoHead"])
  }

  writeApartmentsHeaders()
  writeApartmentsHeaders(21)
  ws.column(12).setWidth(45)
  ws.column(31).setWidth(45)
  let lastRow = 4
  floors.forEach((floor, i) => {
    const frenteLength = floor.apartments.reduce((acc, apartment) => (apartment.orientation == "Frente" && apartment.unit) ? acc + 1 : acc, 0)
    const contrafrenteLength = floor.apartments.reduce((acc, apartment) => (apartment.orientation == "Contrafrente" && apartment.unit) ? acc + 1 : acc, 0)
    const totalRows = frenteLength > contrafrenteLength ? frenteLength : contrafrenteLength

    ws.cell(lastRow, 1, (totalRows || 2) + lastRow - 1, 1, true).string("Frente\n" + floor.title).style({ ...styles["floorInfoHead"], fill: { type: "pattern", patternType: "solid", bgColor: "#ffff00", fgColor: "#ffff00" } })
    ws.cell(lastRow, 20, (totalRows || 2) + lastRow - 1, 20, true).string("Contrafrente\n" + floor.title).style({ ...styles["floorInfoHead"], fill: { type: "pattern", patternType: "solid", bgColor: "#ffff00", fgColor: "#ffff00" } })
    let skippedAapartments = 0
    let whiteApartments = 0
    let blackApartments = 0
    floor.apartments.forEach((apartment, i) => {
      if (!apartment.unit) return skippedAapartments++
      const apartmentTransaction = transactions.find((t) => t.apartment?._id.toString() === apartment._id.toString())
      console.log("-----------------------------------")
      const plusApartments = apartment.orientation == "Frente" ? whiteApartments : blackApartments
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 2 : 21).string(apartment.forSale ? "DISPONIBLE" : "VENDIDO").style({ ...styles["floorInfoCell"], fill: { type: "pattern", patternType: "solid", bgColor: apartment.forSale ? "#88ff88" : "#ff7777", fgColor: apartment.forSale ? "#88ff88" : "#ff7777" } })
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 3 : 22).string(apartment.unit || "").style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 4 : 23).number(apartment.meters?.covered || 0).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 5 : 24).number(apartment.meters?.balcony || 0).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 6 : 25).number(apartment.meters?.uncovered || 0).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 7 : 26).number(apartment.meters?.amenities || 0).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 8 : 27).number(apartment.meters?.total || 0).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 9 : 28).number(apartment.price || 0).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 10 : 29).formula(`${xl.getExcelCellRef(lastRow + i, apartment.orientation == "Frente" ? 9 : 28)} * ${xl.getExcelCellRef(lastRow + i, apartment.orientation == "Frente" ? 8 : 27)}`).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 11 : 30).string(apartment?.rooms).style(styles["floorInfoCell"])
      ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 12 : 31).string(apartment?.owner?.name).style(styles["floorInfoCell"])
      apartmentTransaction && ws.cell(lastRow + plusApartments - skippedAapartments, apartment.orientation == "Frente" ? 13 : 32).number(apartmentTransaction?.total || 0).style(styles["floorInfoCell"])
      apartment.orientation == "Frente" ? whiteApartments++ : blackApartments++
    })
    lastRow += totalRows + 4
  })

  return wb
}

export const createFutureQuotasExcel = (transactions, lastIndexCac, indexCac, secondIndexCac) => {
  const wb = new xl.Workbook()
  const ws = wb.addWorksheet("Cuotas", {
    sheetFormat: {
      'defaultColWidth': 20,
    }
  })

  const styles = {
    project: wb.createStyle({
      ...fontHeadStyle, ...textCenterStyle, ...boldBorder, ...bgHead
    }),

    subsectionInfoHead: wb.createStyle({
      font: {
        bold: true,
        size: 16
      },
      ...textCenterStyle,
      ...boldBorder,
      alignment: {
        wrapText: true,
        textRotation: 90,
        vertical: 'center',
      },
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    subsectionInfoCell: wb.createStyle({
      font: {
        bold: true,
        size: 14
      },
      ...textCenterStyle,
      ...thinBorder,
      numberFormat: '#,##0.00; -#,##0.00; -'
    }),
    sectionHead: wb.createStyle({
      font: {
        size: 14,
        bold: true,
        color: "#FFFFFF"
      },
      ...textCenterStyle,
      ...boldBorder,
      ...bgSectionHead
    }),
    sectionInfoHead: wb.createStyle({
      font: {
        bold: true
      },
      ...textCenterStyle,
      ...boldBorder,
      ...bgSectionInfo
    })
  }

  const cac = indexCac / lastIndexCac * 100 - 100
  const adjustment = cac - (lastIndexCac / secondIndexCac * 100 - 100)
  console.log(adjustment)

  ws.cell(1, 1, 1, 6, true).string("CUOTAS PESOS: A - " + transactions[0]?.apartment?.project?.title || "").style(styles["project"])
  ws.cell(1, 10, 1, 15, true).string("CUOTAS PESOS: B - " + transactions[0]?.apartment?.project?.title || "").style(styles["project"])

  ws.cell(1, 17).string("ANTERIOR").style(styles["sectionHead"])
  ws.cell(1, 18).string("ACTUAL").style(styles["sectionHead"])
  ws.cell(2, 17).number(lastIndexCac).style(styles["sectionInfoHead"])
  ws.cell(2, 18).number(indexCac).style(styles["sectionInfoHead"])


  const writeSectionHead = (row = 3, col = 1) => {
    ws.cell(row - 1, col, row - 1, col + 5, true).string("INFORMACION").style(styles["sectionHead"])
    ws.cell(row, col).string("UF").style(styles["sectionInfoHead"])
    ws.cell(row, col + 1).string("PISO").style(styles["sectionInfoHead"])
    ws.cell(row, col + 2).string("CLIENTE").style(styles["sectionInfoHead"])
    ws.cell(row, col + 3).string("CUOTA").style(styles["sectionInfoHead"])
    ws.cell(row, col + 4).string("CUOTA ANTERIOR").style(styles["sectionInfoHead"])
    ws.cell(row, col + 5).string("CUOTA ACTUAL").style(styles["sectionInfoHead"])
    ws.cell(row, col + 6).string("INTERESES").style(styles["sectionInfoHead"])
    ws.cell(row, col + 7).string("TOTAL").style(styles["sectionInfoHead"])
    ws.cell(row, col + 8).string("TOTAL USD").style(styles["sectionInfoHead"])
  }

  writeSectionHead()
  writeSectionHead(3, 10)

  const lastRow = 4
  let whiteLastRow = 6
  let blackLastRow = 6
  transactions.forEach((t, i) => {
    if (t.white) {
      ws.cell(lastRow + i, 1).string(t.apartment?.unit || "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 2).string(t.apartment?.floor?.title || "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 3).string(t.buyer?.name || "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 4).number(t.white?.lastQuota?.quota + 1 || 0).style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 5).number(t?.white?.lastQuota?.paid != null ? (t.white?.updatedQuota * (t?.dolar || 1) || 0) : t?.white?.updatedQuota).style(styles["subsectionInfoCell"])
      const balance = t?.white?.lastQuota?.paid != null ? ((t.white?.updatedQuota || 0) - ((t.white?.lastQuota?.paid || 0))) : t?.white?.lastQuota?.total - t?.white?.lastQuota?.paidUSD
      ws.cell(lastRow + i, 6).number(t?.white?.lastQuota?.paid != null ? (t.white?.baseIndex ? (indexCac / t.white?.baseIndex * 100 - 100) * (t.white?.baseQuota + (balance > 0 ? balance : 0)) / 100 + (t.white?.baseQuota + (balance > 0 ? balance : 0)) + (balance < 0 ? balance : 0) : ((balance > 0 ? (adjustment * balance / 100) : 0) + (balance > 0 ? balance : 0) + (adjustment * t.white?.lastQuota?.total / 100) + t.white?.updatedQuota) * cac / 100 + ((balance > 0 ? (adjustment * balance / 100) + (balance > 0 ? balance : 0) : balance) + (adjustment * t.white?.lastQuota?.total / 100) + t.white?.updatedQuota)) * (t?.dolar || 1) || 0 : t?.white?.baseQuota + balance).style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 7).number(((t.white?.lastQuota?.interest || 0) * t.white?.updatedQuota / 100) * (t.dolar || 1) || 0).style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 8).formula(t?.white?.lastQuota?.paid != null ? `${xl.getExcelCellRef(lastRow + i, 6)}+${xl.getExcelCellRef(lastRow + i, 7)}` || "" : "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 9).formula(t?.white?.lastQuota?.paid == null ? `${xl.getExcelCellRef(lastRow + i, 6)}+${xl.getExcelCellRef(lastRow + i, 7)}` || "" : "").style(styles["subsectionInfoCell"])
      whiteLastRow++
    }
    if (t.black) {
      ws.cell(lastRow + i, 10).string(t.apartment?.unit || "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 11).string(t.apartment?.floor?.title || "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 12).string(t.buyer?.name || "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 13).number(t.black?.lastQuota?.quota + 1 || 0).style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 14).number(t?.black?.lastQuota?.paid != null ? (t.black?.updatedQuota * (t?.dolar || 1) || 0) : t?.black?.updatedQuota).style(styles["subsectionInfoCell"])
      const balance = t?.black?.lastQuota?.paid != null ? ((t.black?.updatedQuota || 0) - ((t.black?.lastQuota?.paid || 0))) : t?.black?.lastQuota?.total - t?.black?.lastQuota?.paidUSD
      ws.cell(lastRow + i, 15).number(t?.black?.lastQuota?.paid != null ? (t.black?.baseIndex ? (indexCac / t.black?.baseIndex * 100 - 100) * (t.black?.baseQuota + (balance > 0 ? balance : 0)) / 100 + (t.black?.baseQuota + (balance > 0 ? balance : 0)) + (balance < 0 ? balance : 0) : ((balance > 0 ? (adjustment * balance / 100) : 0) + (balance > 0 ? balance : 0) + (adjustment * t.black?.lastQuota?.total / 100) + t.black?.updatedQuota) * cac / 100 + ((balance > 0 ? (adjustment * balance / 100) + (balance > 0 ? balance : 0) : balance) + (adjustment * t.black?.lastQuota?.total / 100) + t.black?.updatedQuota)) * (t?.dolar || 1) || 0 : t?.black?.baseQuota + balance).style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 16).number(((t.black?.lastQuota?.interest || 0) * t.black?.updatedQuota / 100) * (t.dolar || 1) || 0).style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 17).formula(t?.black?.lastQuota?.paid != null ? `${xl.getExcelCellRef(lastRow + i, 15)}+${xl.getExcelCellRef(lastRow + i, 16)}` || "" : "").style(styles["subsectionInfoCell"])
      ws.cell(lastRow + i, 18).formula(t?.black?.lastQuota?.paid == null ? `${xl.getExcelCellRef(lastRow + i, 15)}+${xl.getExcelCellRef(lastRow + i, 16)}` || "" : "").style(styles["subsectionInfoCell"])
      blackLastRow++
    }
  })

  ws.cell(whiteLastRow, 8).formula(`SUM(${xl.getExcelCellRef(lastRow, 8)}:${xl.getExcelCellRef(whiteLastRow - 2, 8)})`).style(styles["subsectionInfoCell"])
  ws.cell(blackLastRow, 17).formula(`SUM(${xl.getExcelCellRef(lastRow, 17)}:${xl.getExcelCellRef(blackLastRow - 2, 17)})`).style(styles["subsectionInfoCell"])
  ws.cell(whiteLastRow, 9).formula(`SUM(${xl.getExcelCellRef(lastRow, 9)}:${xl.getExcelCellRef(whiteLastRow - 2, 9)})`).style(styles["subsectionInfoCell"])
  ws.cell(blackLastRow, 18).formula(`SUM(${xl.getExcelCellRef(lastRow, 18)}:${xl.getExcelCellRef(blackLastRow - 2, 18)})`).style(styles["subsectionInfoCell"])
  return wb
}