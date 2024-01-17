import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form"
import { FaChevronLeft, FaFileExcel } from "react-icons/fa";
import Main from "../containers/Main";
import moment from "moment";
import Form from "../components/Form"

const Transaction = () => {
  const { tid } = useParams();
  const [transaction, setTransaction] = useState(false)
  const { register: black, handleSubmit: submitBlack } = useForm()
  const { register: white, handleSubmit: submitWhite } = useForm()
  const navigate = useNavigate()
  const input = useRef()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${tid}`, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setTransaction(json.payload));
  }, []);

  const handleSubmitFunc = async (formData, type) => {
    const data = formData
    if (!transaction[type].baseIndex) {
      data.total = data.cac * transaction[type]?.updatedQuota / 100 + transaction[type]?.updatedQuota
    }
    else {
      const cacHistory = await (await fetch("https://prestamos.ikiwi.net.ar/api/cacs")).json()
      data.indexCac = cacHistory.find((cac,i) => cac.period == (moment().subtract(2, "months").format("YYYY-MM")).toString() + "-01").general
      data.total = (transaction[type].baseQuota * (100 - (transaction[type].baseIndex * 100 / cacHistory[cacHistory.length - 1].general)) / 100) + transaction[type].baseQuota
    }

    data.quota = transaction[type]?.lastQuota?.quota + 1
    data.type = type
    data.transaction = transaction?._id
    data.date = moment().format("DD-MM-YYYY")
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/quota`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json()
    navigate("/inmueble/" + transaction?.apartment?._id)
  }

  const addQuota = async (e, type) => {
    e.preventDefault()
    const onSubmit = type == "black" ? submitBlack(async (data) => handleSubmitFunc(data, type)) : submitWhite(async (data) => handleSubmitFunc(data, type))
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
          <section className="flex justify-evenly items-start w-full">
            {[{ type: "white", white: transaction.white }, { type: "black", black: transaction.black }].map((t, i) => {
              return <div className="bg-cyan-600 flex flex-col gap-y-4 px-3 py-4 rounded-lg text-fourth" key={i}>
                <h2 className="text-3xl border-b-4 w-full text-center">{t.type == "white" ? "A" : "B"}</h2>
                <p className="text-2xl">Cuota base: {t[t.type]?.baseQuota}</p>
                <p className="text-2xl">Cuotas totales: {t[t.type]?.quotas}</p>
                <p className="text-2xl">N° Cuota: {t[t.type]?.lastQuota?.quota}</p>
                <p className="text-2xl">Cuota actualizada: {t[t.type]?.updatedQuota || t[t.type]?.baseQuota}</p>
                {t[t.type]?.quotas == t[t.type]?.lastQuota?.quota ? <h3 className="text-4xl text-center bg-cyan-500/60">SALDADO</h3> : (<Form register={t.type == "black" ? black : white} fields={!transaction?.white?.baseIndex ? [{ type: "number", name: "cac", label: "CAC" }, { type: "number", name: "adjustment", label: "Ajuste" }, { type: "number", name: "extraAdjustment", label: "Re Ajuste" }] : []} className={"!bg-gradient-to-t from-cyan-500 to-transparent"} onSubmit={(e) => addQuota(e, t.type)} />)}
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
