import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form"
import { FaChevronLeft, FaFileExcel } from "react-icons/fa";
import Toastify from "toastify-js"
import Main from "../containers/Main";
import moment from "moment";
import Form from "../components/Form"
import "toastify-js/src/toastify.css"

const Transaction = () => {
  const { tid } = useParams();
  const [transaction, setTransaction] = useState(false)
  const [reload, setReload] = useState(false)
  const { register: black, handleSubmit: submitBlack, reset: resetBlack } = useForm()
  const { register: white, handleSubmit: submitWhite, reset: resetWhite } = useForm()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${tid}`, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setTransaction(json.payload));
  }, [reload]);

  const handleSubmitFunc = async (formData, type) => {
    const data = formData
    const wasCac = data.indexCac
    if (!transaction[type].baseIndex && (transaction[type]?.lastQuota?.cac == 0 || transaction[type]?.lastQuota?.cac)) {
      const totalWithAdjustment = ((transaction[type]?.lastQuota?.total || transaction[type]?.baseQuota) * (Number(data.adjustment || 0) + Number(data.extraAdjustment || 0)) / 100) + transaction[type]?.updatedQuota
      data.total = totalWithAdjustment
    }
    else {
      const cacHistory = await (await fetch("https://prestamos.ikiwi.net.ar/api/cacs")).json()
      data.indexCac = Number(data.indexCac) || cacHistory.find((cac, i) => cac.period == (moment().subtract(2, "months").format("YYYY-MM")).toString() + "-01").general
      data.total = transaction[type].baseQuota + ((data.indexCac / (transaction[type].baseIndex || data.indexCac) * 100 - 100) * transaction[type].baseQuota / 100)
    }

    data.baseIndex = transaction[type].baseIndex || data.indexCac
    data.quota = transaction[type]?.lastQuota?.quota + 1 || 1
    data.type = type
    data.transaction = transaction?._id
    data.date = moment().format("DD-MM-YYYY")
    console.log(data)
    wasCac && await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${transaction?._id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ baseIndex: data.indexCac }) })).json()
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/quota`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json()
    setReload(!reload)
    Toastify({
      text: `Cuota ${result?.payload?.quota} cobrada exitosamente`,
      duration: 3000,
      gravity: "top",
      position: "right",
      offset: {
        y: 120
      },
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function () { } // Callback after click
    }).showToast();
  }

  const addQuota = async (e, type) => {
    e.preventDefault()
    const onSubmit = type == "black" ? submitBlack(async (data) => (handleSubmitFunc(data, "black"), resetBlack())) : submitWhite(async (data) => (handleSubmitFunc(data, "white"), resetWhite()))
    onSubmit()
  }

  return (
    <Main className={"items-center pt-[200px] pb-[100px] bg-sixth gap-y-[50px]"}>
      {transaction ? (
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
              return <div className="bg-indigo-500 w-4/5 flex flex-col gap-y-8 px-5 w-2/5 py-4 border-4 border-fourth rounded-xl text-fourth" key={i}>
                <h2 className="text-7xl border-b-4 py-3 drop-shadow-[10px_10px_10px_rgba(0,0,0,1)] w-full text-center">{t.type == "white" ? "A" : "B"}</h2>
                <p className="text-4xl">{t.type == "white" ? `Boleto: $${transaction.total * 60 / 100}` : `Reconocimiento de deuda: $${transaction.total * 40 / 100}`}</p>
                <p className="text-4xl">Adelanto inicial: ${t.type == "white" ? transaction.booking : transaction.bookingB}</p>
                <p className="text-4xl">Cuota base: ${t[t.type]?.baseQuota?.toFixed(2) || ""}</p>
                <p className="text-4xl">Cuotas totales: {t[t.type]?.quotas}</p>
                <p className="text-4xl">Cuotas pagadas: {t[t.type]?.lastQuota?.quota}</p>
                <p className="text-4xl">Valor cuota {t[t.type]?.lastQuota?.quota}: ${t[t.type]?.updatedQuota?.toFixed(2) || t[t.type]?.baseQuota?.toFixed(2) || ""}</p>
                {t[t.type]?.quotas == t[t.type]?.lastQuota?.quota ? <h3 className="text-4xl text-center bg-cyan-500/60">SALDADO</h3> : (<Form register={t.type == "black" ? black : white} fields={(!transaction?.white?.baseIndex && transaction?.white?.lastQuota?.cac != null) ? [{ type: "number", name: "cac", label: "CAC %" }, { type: "number", name: "adjustment", label: "Ajuste %" }, { type: "number", name: "extraAdjustment", label: "Re Ajuste %" }] : [{ type: "number", name: "indexCac", label: "INDICE BASE MANUAL" }]} className={"!bg-gradient-to-t from-cyan-500 to-transparent"} onSubmit={(e) => addQuota(e, t.type)} />)}
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
