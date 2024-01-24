import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form"
import { FaChevronLeft, FaFileExcel, FaMoneyBillWave } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md"
import Swal from "sweetalert2"
import Main from "../containers/Main";
import moment from "moment";
import Form from "../components/Form"

const Transaction = () => {
  const { tid } = useParams();
  const [transaction, setTransaction] = useState(false)
  const [quotas, setQuotas] = useState(false)
  const [reload, setReload] = useState(false)
  const [cacHistory, setCacHistory] = useState([])
  const [dollar, setDollar] = useState(false)
  const [blackDollar, setBlackDollar] = useState(false)


  const { register: black, handleSubmit: submitBlack, reset: resetBlack } = useForm()
  const { register: white, handleSubmit: submitWhite, reset: resetWhite } = useForm()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${tid}`, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setTransaction(json.payload));
  }, [reload]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/quota/${tid}`, { credentials: "include" })
      .then(res => res.json())
      .then(json => setQuotas(json.payload))
  }, [reload])

  useEffect(() => {
    fetch("https://prestamos.ikiwi.net.ar/api/cacs").then(res => res.json()).then(json => setCacHistory(json))
  }, [])

  const handleSubmitFunc = async (formData, type) => {
    const data = formData
    data.baseIndex = Number(data.baseIndex)
    const lastIndex = cacHistory[cacHistory.length - 1]?.general
    const secondIndex = cacHistory[cacHistory.length - 2]?.general
    const thirdIndex = cacHistory[cacHistory.length - 3]?.general

    const balance = transaction[type].updatedQuota - (Number(transaction[type].lastQuota?.paid) || 1)
    data.balance = balance
    if (transaction[type]?.lastQuota?.paid && data.paidUSD != null) {
      const lastPesosQuotas = []
      quotas?.forEach((quota, i) => {
        !quota?.paidUSD ? (quota.type == type && lastPesosQuotas.push(quota)) : lastPesosQuotas.length = 0
      })

      const currencyChangeDifference = lastPesosQuotas.reduce((acc, pesosQuota) => {
        const updatedPaid = pesosQuota?.paid * transaction.dolar / pesosQuota?.dollarPrice
        return acc + updatedPaid
      }, 0) - lastPesosQuotas.length * transaction[type]?.baseQuota

      data.total = transaction[type].baseQuota - currencyChangeDifference

      if (transaction[type].baseIndex) {
        data.indexCac = data.baseIndex || Number(data.indexCac) || lastIndex
        data.baseIndex = transaction[type].baseIndex || data.baseIndex || lastIndex
      }
      else {
        data.cac = lastIndex / secondIndex * 100 - 100
      }
    }
    else if (transaction[type]?.lastQuota?.paidUSD && data.paid != null) {
      const lastDollarQuotas = []
      quotas?.forEach((quota, i) => {
        !quota?.paid ? (quota.type == type && lastDollarQuotas.push(quota)) : lastDollarQuotas.length = 0
      })

      const currencyChangeDifference = !transaction[type].baseIndex ? (
        lastDollarQuotas.reduce((acc,dollarQuota,i) => {
          const updatedPaid = dollarQuota?.paidUSD * dollarQuota?.dollarPrice
          const quotaAfterAdjustment = !i ? dollarQuota?.total + (lastDollarQuotas[i-1] * dollarQuota?.adjustment / 100) : dollarQuota?.total
          const updatedQuota = (quotaAfterAdjustment + (quotaAfterAdjustment * dollarQuota?.cac / 100)) * dollarQuota?.dollarPrice
          console.log(acc, "...............", updatedQuota, ".....................". updatedPaid)
          return acc + (updatedQuota - updatedPaid)
        }) 
      ) : (
        lastDollarQuotas.reduce((acc,dollarQuota) => {
          const updatedPaid = dollarQuota?.paidUSD * dollarQuota?.dollarPrice
          const updatedQuota = dollarQuota?.total + (dollarQuota?.total * (dollarQuota?.indexCac / transaction[type]?.baseIndex * 100 - 100) / 100)
          console.log(acc, "...............", updatedQuota, ".....................". updatedPaid)
          return acc + (updatedQuota - updatedPaid)
        })
      )
      
      if (transaction[type].baseIndex) {
        data.indexCac = data.baseIndex || Number(data.indexCac) || lastIndex
        data.baseIndex = transaction[type].baseIndex || data.baseIndex || lastIndex
        const totalWithoutAdjustment = ((transaction[type]?.baseQuota * transaction.dolar) - currencyChangeDifference) / transaction.dolar
      }
      else {
        data.cac = lastIndex / secondIndex * 100 - 100
      }
    }
    else {
      if (!transaction[type].baseIndex && (transaction[type]?.lastQuota?.cac == 0 || transaction[type]?.lastQuota?.cac)) {
        data.cac = lastIndex / secondIndex * 100 - 100
        data.adjustment = data.cac - (secondIndex / thirdIndex * 100 - 100)
        if (data.paidUSD == null) {
          const totalWithAdjustment = ((transaction[type]?.lastQuota?.total || transaction[type]?.baseQuota) * (Number(data.adjustment || 0) + Number(data.extraAdjustment || 0)) / 100) + transaction[type]?.updatedQuota + (balance > 0 ? balance * (Number(data.adjustment || 0) + Number(data.extraAdjustment || 0)) / 100 + balance : 0)
          data.total = totalWithAdjustment
        }
        else {
          data.total = transaction[type].baseQuota + (transaction[type]?.lastQuota?.total - transaction[type].lastQuota?.paidUSD)
        }
      }
      else {
        data.indexCac = data.baseIndex || Number(data.indexCac) || lastIndex
        data.baseIndex = transaction[type].baseIndex || data.baseIndex || lastIndex
        if (data.paidUSD == null) {
          data.total = transaction[type].baseQuota + (balance > 0 ? balance : 0) + ((data.indexCac / (data.baseIndex || transaction[type].baseIndex) * 100 - 100) * (transaction[type].baseQuota + (balance > 0 ? balance : 0)) / 100) + (balance < 0 ? balance : 0)
        }
        else {
          data.total = transaction[type].baseQuota + (transaction[type]?.lastQuota?.total - transaction[type].lastQuota?.paidUSD)
        }
      }
    }


    data.paid = (Number(data.paid) / transaction?.dolar) || null
    data.paidUSD = Number(data.paidUSD)
    data.dollarPrice = Number(data.dollarPrice || 1)
    data.quota = transaction[type]?.lastQuota?.quota + 1 || 1
    data.type = type
    data.transaction = transaction?._id
    data.date = moment().format("DD-MM-YYYY")

    !(transaction[type]?.lastQuota?.cac == 0 || transaction[type]?.lastQuota?.cac) && await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${transaction?._id}/${type}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baseIndex: data.baseIndex }) })).json()
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/quota`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json()
    setReload(!reload)
    Swal.fire({
      title: `Cuota ${result?.payload?.quota} ${result.payload.type == "white" ? "A" : "B"}\nCobrada exitosamente!`,
      icon: "success",
      showConfirmButton: false,
      timer: 3500,
      iconColor: "#00ff00",
      customClass: {
        popup: "bg-second text-fourth rounded-none border-4 border-fourth shadow-xl shadow-first",
      }
    })
  }

  const addQuota = async (e, type) => {
    e.preventDefault()
    const onSubmit = type == "black" ? submitBlack(async (data) => (handleSubmitFunc(data, "black"), resetBlack())) : submitWhite(async (data) => (handleSubmitFunc(data, "white"), resetWhite()))
    onSubmit()
  }

  const cacFields = [
    { type: "number", name: "extraAdjustment", label: "Re Ajuste %" },
    { type: "number", name: "interest", label: "Interes %", className: "w-[300px]" },
    { type: "number", name: "dollarPrice", label: "Valor USD actual", className: "w-[300px]" },
  ]

  const indexFields = [
    { type: "number", name: "indexCac", label: "INDICE CAC MANUAL" },
    { type: "number", name: "interest", label: "Interes %", className: "w-[300px]" },
    { type: "number", name: "dollarPrice", label: "Valor USD actual", className: "w-[300px]" },
  ]

  return (
    <Main className={"items-center pt-[200px] pb-[100px] bg-sixth gap-y-[50px]"}>
      {(transaction && quotas) ? (
        <>
          <div className="flex w-full justify-between">
            <Link to={"/inmueble/" + transaction?.apartment?._id}><FaChevronLeft className="text-6xl text-fourth" /></Link>
            <h1 className="text-6xl text-fourth font-black">
              {transaction.apartment?.project?.title} - UF:{" "}
              {transaction.apartment?.unit}
            </h1>
            <a href={`${import.meta.env.VITE_REACT_API_URL}/api/transaction/excel/${transaction?._id}`} download className="cursor-pointer"><FaFileExcel className="text-fourth" size={40} /></a>
          </div>
          <section className="grid xl:grid-cols-2 gap-8 justify-items-center w-full">
            {[{ type: "white", white: transaction.white }, { type: "black", black: transaction.black }].map((t, i) => {
              const typeIndexFields = [...indexFields]
              const cacIndexFields = [...cacFields]
              const setDollarState = t.type == "white" ? setDollar : setBlackDollar
              const dollarState = t.type == "white" ? dollar : blackDollar
              cacIndexFields.splice(1, 0, { type: "number", name: `${!dollarState ? "paid" : "paidUSD"}`, label: `Cuota N°${t[t.type]?.lastQuota?.quota + 1 || 1}${dollarState ? " USD" : ""}`, className: `w-[300px]` })
              !t[t.type]?.baseIndex && typeIndexFields.splice(0, 0, { type: "number", name: "baseIndex", label: "INDICE BASE MANUAL" })
              typeIndexFields.splice(1, 0, { type: "number", name: `${!dollarState ? "paid" : "paidUSD"}`, label: `Cuota N°${t[t.type]?.lastQuota?.quota + 1 || 1}${dollarState ? " USD" : ""}`, className: `w-[300px]` })

              return <div className={`${!dollarState ? "bg-indigo-500 text-fourth" : "bg-emerald-400"} duration-300 w-4/5 flex flex-col gap-y-8 px-5 w-2/5 py-4 border-4 border-fourth rounded-xl`} key={i}>
                <div className="flex items-center border-b-4 px-8">
                  <h2 className="text-7xl py-3 drop-shadow-[10px_10px_10px_rgba(0,0,0,1)] w-full text-center">{t.type == "white" ? "A" : "B"}</h2>
                  <div onClick={() => setDollarState(!dollarState)}>
                    {!dollarState ? <FaMoneyBillWave size={50} className="text-emerald-400" /> : <MdAttachMoney className="text-indigo-500" size={50} />}
                  </div>
                </div>
                <p className="text-4xl">{t.type == "white" ? `Boleto: U$D ${transaction.total * 60 / 100} / $ ${transaction.total * 60 / 100 * transaction?.dolar || 1}` : `Deuda: U$D ${transaction.total * 40 / 100} / $ ${transaction.total * 40 / 100 * transaction.dolar || 1}`}</p>
                <p className="text-4xl">Precio dolar: {transaction?.dolar || 1}</p>
                <p className="text-4xl">Adelanto inicial: $ {(t.type == "white" ? transaction.booking : transaction.bookingB) * transaction.dolar}</p>
                <p className="text-4xl">Cuota base: $ {(t[t.type]?.baseQuota * transaction?.dolar).toFixed(2) || ""}</p>
                {t[t.type]?.baseIndex ? <p className="text-4xl">Indice base: {t[t.type]?.baseIndex}</p> : null}
                {cacHistory.length ? <p className="text-4xl">Indice actual: {cacHistory[cacHistory.length - 1]?.general}</p> : null}
                <p className="text-4xl">Cuotas totales: {t[t.type]?.quotas}</p>
                <p className="text-4xl">Cuotas pagadas: {t[t.type]?.lastQuota?.quota || 0}</p>
                <p className="text-4xl">Cuotas pendientes: {(t[t.type]?.quotas - t[t.type]?.lastQuota?.quota) || t[t.type]?.quotas}</p>
                <p className="text-4xl">Valor cuota N°{t[t.type]?.lastQuota?.quota}: $ {((t[t.type]?.updatedQuota || t[t.type]?.baseQuota) * (dollarState ? 1 : transaction?.dolar)).toFixed(2) || ""}</p>
                {t[t.type]?.quotas == t[t.type]?.lastQuota?.quota ? <h3 className="text-4xl text-center bg-cyan-500/60">SALDADO</h3> : (<Form register={t.type == "black" ? black : white} fields={(!transaction?.white?.baseIndex && transaction?.white?.lastQuota?.cac != null) ? cacIndexFields : typeIndexFields} className={`!bg-gradient-to-t from-cyan-500 to-transparent mt-auto ${dollarState && "!text-first"}`} onSubmit={(e) => addQuota(e, t.type)} />)}
              </div>
            })}
          </section>
        </>
      ) : (
        <BounceLoader size={100} />
      )}
    </Main>
  );
};

export default Transaction;
