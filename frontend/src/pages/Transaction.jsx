import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { BounceLoader } from "react-spinners";
import { useForm } from "react-hook-form"
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
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${tid}`)
      .then((res) => res.json())
      .then((json) => setTransaction(json.payload));
  }, []);

  const addQuota = async (e, type) => {
    e.preventDefault()
    const onSubmit = type == "black" ? submitBlack(async data => {
      data.total = data.cac * transaction[type]?.updatedQuota / 100 + transaction[type]?.updatedQuota
      data.quota = transaction[type]?.lastQuota?.quota + 1
      data.type = type
      data.transaction = transaction?._id
      data.date = moment().format("DD-MM-YYYY")
      const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/quota`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json()
      navigate("/inmueble/"+transaction?.apartment?._id)
    }) : submitWhite(async data => {
      data.total = data.cac * transaction[type]?.updatedQuota / 100 + transaction[type]?.updatedQuota
      data.quota = transaction[type]?.lastQuota?.quota + 1
      data.type = type
      data.transaction = transaction?._id
      data.date = moment().format("DD-MM-YYYY")
      const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/quota`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })).json()
      navigate("/inmueble/"+transaction?.apartment?._id)
    })
    onSubmit()
  }

  return (
    <Main className={"items-center pt-[200px] pb-[100px] bg-sixth gap-y-[50px]"}>
      {transaction ? (
        <>
          <h1 className="text-6xl text-fourth font-black">
            {transaction.apartment?.project?.title} - UF:{" "}
            {transaction.apartment?.unit}
          </h1>
          <section className="flex justify-evenly w-full">
            {[{ type: "white", white: transaction.white }, { type: "black", black: transaction.black }].map((t, i) => {
              return <div className="bg-cyan-600 flex flex-col gap-y-4 px-3 py-4 rounded-lg text-fourth">
                <h2 className="text-3xl border-b-4 w-full text-center">{t.type == "white" ? "A" : "B"}</h2>
                <p className="text-2xl">Cuota base: {t[t.type]?.baseQuota}</p>
                <p className="text-2xl">Cuotas totales: {t[t.type]?.quotas}</p>
                <p className="text-2xl">N° Cuota: {t[t.type]?.lastQuota?.quota}</p>
                <p className="text-2xl">Cuota actualizada: {t[t.type]?.updatedQuota || t[t.type]?.baseQuota}</p>
                <Form register={t.type == "black" ? black : white} fields={[{ type: "number", name: "cac", label: "CAC" }, { type: "number", name: "adjustment", label: "Ajuste" }, { type: "number", name: "extraAdjustment", label: "Re Ajuste" }]} className={"!bg-gradient-to-t from-cyan-500 to-transparent"} onSubmit={(e) => addQuota(e,t.type)} />
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
