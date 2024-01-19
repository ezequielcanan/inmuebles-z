import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useForm } from "react-hook-form";
import moment from "moment"
import Form from "../components/Form";
import Main from "../containers/Main";
import ApartmentCard from "../components/ApartmentCard";

const NewTransaction = () => {
  const [apartment, setApartment] = useState(false);
  const [formIndex, setFormIndex] = useState(0);
  const [ownerSuggestions, setOwnerSuggestions] = useState([]) 
  const [suggestedOwner, setSuggestedOwner] = useState(false)
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { inmueble } = useParams();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/apartments/${inmueble}`, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setApartment(json.payload));
  }, []);

  const ownerTextSearch = async (text) => {
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/owner?query=${text}`, {credentials: "include"})).json()
    setOwnerSuggestions(text.split(" ").length > 1 ? [] : result.payload)
  }

  const onSubmit = handleSubmit(async (data) => {
    const buyer = JSON.stringify(suggestedOwner || {
      name: data.name,
      number: data.number,
      ownerType: data.ownerType,
      email: data.email,
    });
    const ownerResult = await (
      await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/owner`, {
        method: "POST",
        body: buyer,
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
    ).json();
    const apartmentRes = await (
      await fetch(
        `${import.meta.env.VITE_REACT_API_URL}/api/apartments/${inmueble}`,
        {
          method: "PUT",
          body: JSON.stringify({ owner: ownerResult.payload._id }),
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
      )
    ).json()
    const today = moment().format("DD-MM-YYYY")
    const whiteBaseQuota = ((Number(data.total) * 60 / 100) - Number(data.booking)) / Number(data["quotas"]).toFixed(2)
    const blackBaseQuota = ((Number(data.total) * 40 / 100) - Number(data.bookingB)) / Number(data["b-quotas"]).toFixed(2)

    const transactionBody = {
      transaction: {
        apartment: apartment?._id,
        seller: apartment?.owner,
        buyer: ownerResult.payload._id,
        total: data.total,
        booking: data.booking,
        bookingB: data.bookingB,
        white: { quotas: data.quotas, baseQuota: whiteBaseQuota },
        black: {
          quotas: data["b-quotas"],
          baseQuota: blackBaseQuota
        },
      },
    }

    if (data["cac"] == "") {
      fetch("https://prestamos.ikiwi.net.ar/api/cacs").then(res => res.json()).then(async json => {
        const cacHistory = json
        const cacIndex = cacHistory.find((cac,i) => cac.period == (moment().subtract(2, "months").format("YYYY-MM")).toString() + "-01").general

        /*transactionBody.black = {
          indexCac: cacIndex, total: blackBaseQuota, quota: 1, type: "black", date: today, adjustment: 0, extraAdjustment: 0
        }
        transactionBody.white = {
          indexCac: cacIndex, total: whiteBaseQuota, quota: 1, type: "white", date: today, adjustment: 0, extraAdjustment: 0
        }

        transactionBody.transaction.white.baseIndex = cacIndex
        transactionBody.transaction.black.baseIndex = cacIndex*/

        const transactionRes = await (
          await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction`, {
            method: "POST",
            body: JSON.stringify(transactionBody),
            headers: { "Content-Type": "application/json" },
            credentials: "include"
          })
        ).json();
        navigate("/inmueble/" + inmueble);

      })
    } else {
      transactionBody.black = {
        cac: data["b-cac"], total: blackBaseQuota, quota: 1, type: "black", date: today, adjustment: 0, extraAdjustment: 0
      }
      transactionBody.white = {
        cac: data["cac"], total: whiteBaseQuota, quota: 1, type: "white", date: today, adjustment: 0, extraAdjustment: 0
      }

      const transactionRes = await (
        await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction`, {
          method: "POST",
          body: JSON.stringify(transactionBody),
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
      ).json();
      navigate("/inmueble/" + inmueble);
    }
  });

  const fields = [
    {
      type: "text",
      name: "name",
      label: "Nuevo titular",
      onChange: ownerTextSearch,
      suggestions: ownerSuggestions,
      setOwner: setSuggestedOwner,
      suggestedOwner
    },
    {
      type: "select",
      name: "ownerType",
      label: "Tipo de titular:",
      options: ["Particular", "Accionista", "Sociedad", "Gremio"],
      disabled: suggestedOwner && true
    },
    {
      type: "text",
      name: "number",
      label: "Numero de telefono",
      disabled: suggestedOwner && true
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      disabled: suggestedOwner && true
    },
  ];

  const secondFields = [
    {
      type: "number",
      name: "booking",
      label: "Adelanto A:",
      className: "w-[200px]",
    },
    {
      type: "number",
      name: "cac",
      label: "CAC A",
      className: "w-[200px]",
    },
    {
      type: "number",
      name: "quotas",
      label: "Cuotas totales A:",
      className: "w-[200px]",
    },
  ];

  const thirdFields = [
    {
      type: "number",
      name: "bookingB",
      label: "Adelanto B:",
      className: "w-[200px]",
    },
    {
      type: "number",
      name: "b-cac",
      label: "CAC B",
      className: "w-[200px]",
    },
    {
      type: "number",
      name: "b-quotas",
      label: "Cuotas totales B:",
      className: "w-[200px]",
    },
  ];

  return (
    <Main className={"pt-[200px] pb-[100px] items-center bg-sixth"}>
      {apartment ? (
        <section className="flex w-full h-full items-center text-fourth gap-x-[20px] justify-between">
          <div className="flex gap-x-[20px] items-center">
            <ApartmentCard apartment={apartment} className={"mr-auto"} />
            <h1 className="text-4xl">Venta / Cesion</h1>
            <FaArrowRight size={50} />
          </div>
          <div className="flex relative">
            {!formIndex ? (
              <Form
                fields={fields}
                className={"!px-16 w-[700px]"}
                register={register}
                enter={false}
              />
            ) : null}
            {formIndex == 1 ? (
              <Form
                fields={[{
                  type: "number",
                  name: "total",
                  label: "VALOR TOTAL (A+B):",
                  className: "w-[200px]",
                }]}
                className={"!px-16 w-[700px]"}
                register={register}
                onSubmit={onSubmit}
                enter={false}
              />
            ) : null}
            {formIndex == 2 ? (
              <Form
                fields={secondFields}
                className={"!px-16 w-[700px]"}
                register={register}
                enter={false}
              />
            ) : null}
            {formIndex == 3 ? (
              <Form
                fields={thirdFields}
                className={"!px-16 w-[700px]"}
                register={register}
                onSubmit={onSubmit}
              />
            ) : null}
            {formIndex ? (
              <FaChevronLeft
                className="text-fourth absolute top-[50%] left-[1%]"
                size={30}
                onClick={() => setFormIndex(formIndex - 1)}
              />
            ) : null}
            {formIndex < 3 ? (
              <FaChevronRight
                className="text-fourth absolute top-[50%] right-[1%]"
                size={30}
                onClick={() => setFormIndex(formIndex + 1)}
              />
            ) : null}
          </div>
        </section>
      ) : (
        <BounceLoader />
      )}
    </Main>
  );
};

export default NewTransaction;
