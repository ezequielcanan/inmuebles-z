import { useParams } from "react-router-dom";
import Main from "../containers/Main";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

const Transaction = () => {
  const { tid } = useParams();
  const [transaction, setTransaction] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction/${tid}`)
      .then((res) => res.json())
      .then((json) => setTransaction(json.payload));
  }, []);

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
               return <div className="bg-cyan-600 flex flex-col gap-y-4 items-center px-3 py-4 rounded-lg text-fourth">
                <h2 className="text-3xl border-b-4 w-full text-center">{t.type == "white" ? "A" : "B"}</h2>
                <p className="text-2xl">Cuota base: {t[t.type]?.baseQuota}</p>
                <p className="text-2xl">Cuotas totales: {t[t.type]?.quotas}</p>
                <p className="text-2xl">N° Cuota: {t[t.type]?.lastQuota}</p>
                <p className="text-2xl">Cuota actualizada: {t[t.type]?.updatedQuota || t[t.type]?.baseQuota}</p>
                <div className="flex gap-x-4 items-center">
                  <label htmlFor="cac">CAC</label>
                  <input type="number" name="cac" className="text-first focus:outline-none px-3 py-1"/>
                </div>
                <button className="bg-second rounded py-2 px-3">Agregar cuota</button>
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
