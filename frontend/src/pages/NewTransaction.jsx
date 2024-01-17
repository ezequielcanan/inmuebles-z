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
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { inmueble } = useParams();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/apartments/${inmueble}`, { credentials: "include" })
      .then((res) => res.json())
      .then((json) => setApartment(json.payload));
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    const buyer = JSON.stringify({
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

    if (!data["cac"]) {
      fetch("https://prestamos.ikiwi.net.ar/api/cacs").then(res => res.json()).then(async json => {
        const cacHistory = json
        transactionBody.black = {
          indexCac: cacHistory[cacHistory.length - 1].general, total: blackBaseQuota, quota: 1, type: "black", date: today, adjustment: 0, extraAdjustment: 0
        }
        transactionBody.white = {
          indexCac: cacHistory[cacHistory.length - 1].general, total: whiteBaseQuota, quota: 1, type: "white", date: today, adjustment: 0, extraAdjustment: 0
        }

        transactionBody.transaction.white.baseIndex = cacHistory[cacHistory.length - 1].general
        transactionBody.transaction.black.baseIndex = cacHistory[cacHistory.length - 1].general

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
    },
    {
      type: "select",
      name: "ownerType",
      label: "Tipo de titular:",
      options: ["Particular", "Accionista", "Sociedad", "Gremio"],
    },
    {
      type: "text",
      name: "number",
      label: "Numero de telefono",
    },
    {
      type: "text",
      name: "email",
      label: "Email",
    },
  ];

  const secondFields = [
    {
      type: "number",
      name: "total",
      label: "TOTAL:",
      className: "w-[200px]",
    },
    {
      type: "number",
      name: "booking",
      label: "Adelanto:",
      className: "w-[200px]",
    },
    {
      type: "number",
      name: "cac",
      label: "CAC",
      className: "w-[200px]",
    },
    {
      type: "number",
      name: "quotas",
      label: "Cuotas totales:",
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
            <h1 className="text-4xl">Venta y/o transferencia</h1>
            <FaArrowRight size={50} />
          </div>
          <div className="flex relative">
            {!formIndex ? (
              <Form
                fields={fields}
                className={"!px-16"}
                register={register}
                enter={false}
              />
            ) : null}
            {formIndex == 1 ? (
              <Form
                fields={secondFields}
                className={"!px-16"}
                register={register}
                enter={false}
              />
            ) : null}
            {formIndex == 2 ? (
              <Form
                fields={thirdFields}
                className={"!px-16"}
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
            {formIndex < 2 ? (
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
