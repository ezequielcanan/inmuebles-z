import { useNavigate, useParams } from "react-router-dom";
import Main from "../containers/Main";
import { useEffect, useState, useRef } from "react";
import { BounceLoader } from "react-spinners";
import moment from "moment";

const Transaction = () => {
  const { tid } = useParams();
  const [transaction, setTransaction] = useState(false)
  const [blackCac, setBlackCac] = useState(0)
  const [whiteCac, setWhiteCac] = useState(0)
  const navigate = useNavigate()
  const input = useRef()
  
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${tid}`)
      .then((res) => res.json())
      .then((json) => setTransaction(json.payload));
  }, []);

  const addQuota = async (type) => {
    const cac = type == "black" ? blackCac : whiteCac
    const newQuota = {
      date: moment().format("DD-MM-YYYY"),
      cac,
      total: cac * transaction[type]?.updatedQuota / 100 + transaction[type]?.updatedQuota,
      quota: transaction[type]?.lastQuota?.quota + 1,
      type,
      transaction: transaction?._id
    }
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/quota`, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(newQuota)})).json()
    navigate("/inmueble/"+transaction?.apartment?._id)
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
            {[{type: "white", white: transaction.white}, {type: "black", black: transaction.black}].map((t,i) => {
               return <div className="bg-cyan-600 flex flex-col gap-y-4 px-3 py-4 rounded-lg text-fourth">
                <h2 className="text-3xl border-b-4 w-full text-center">{t.type == "white" ? "A" : "B"}</h2>
                <p className="text-2xl">Cuota base: {t[t.type]?.baseQuota}</p>
                <p className="text-2xl">Cuotas totales: {t[t.type]?.quotas}</p>
                <p className="text-2xl">N° Cuota: {t[t.type]?.lastQuota?.quota}</p>
                <p className="text-2xl">Cuota actualizada: {t[t.type]?.updatedQuota || t[t.type]?.baseQuota}</p>
                <div className="flex gap-x-4 items-center">
                  <label htmlFor="cac" className="text-2xl">CAC</label>
                  <input type="number" name="cac" className="text-first focus:outline-none px-3 py-1" ref={input} value={t.type=="black" ? blackCac : whiteCac} onChange={(e) => t.type == "black" ? setBlackCac(e.target.value) : setWhiteCac(e.target.value)}/>
                </div>
                <button className="bg-second rounded py-2 px-3" onClick={() => addQuota(t.type)}>Cobrar cuota</button>
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
