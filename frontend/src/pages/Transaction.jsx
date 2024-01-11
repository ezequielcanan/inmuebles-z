import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useForm } from "react-hook-form"
import Form from "../components/Form"
import Main from "../containers/Main"
import ApartmentCard from "../components/ApartmentCard"

const Transaction = () => {
  const [apartment, setApartment] = useState(false)
  const [formIndex, setFormIndex] = useState(0)
  const navigate = useNavigate()
  const {register, handleSubmit} = useForm()
  const { inmueble } = useParams()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/apartments/${inmueble}`).then(res => res.json()).then(json => setApartment(json.payload))
  }, [])

  const onSubmit = handleSubmit(async data => {
    const buyer = JSON.stringify(data)
    const ownerResult = await(await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/owner`, {method: "POST", body: buyer, headers: {"Content-Type": "application/json"}})).json()
    const apartmentRes = await(await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/apartments/${inmueble}`, {method: "PUT", body: JSON.stringify({owner: ownerResult.payload._id}), headers: {"Content-Type": "application/json"}})).json()
    const transactionRes = await(await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/transaction`, {method: "POST", body: JSON.stringify({apartment: apartment?._id, seller: apartment?.owner, buyer: ownerResult.payload._id}), headers: {"Content-Type": "application/json"}})).json()
    navigate("/inmueble/"+inmueble)
  })

  const fields = [
    {
      type: "text",
      name: "name",
      label: "Nuevo titular"
    },
    {
      type: "select",
      name: "ownerType",
      label: "Tipo de titular:",
      options: [
        "Particular",
        "Accionista",
        "Sociedad",
        "Gremio"
      ],
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
    }
  ]

  return (
    <Main className={"pt-[200px] items-center bg-sixth"}>
      {apartment ? (
        <section className="flex w-full h-full items-center text-fourth gap-x-[20px] justify-between">
          <div className="flex gap-x-[20px] items-center">
            <ApartmentCard apartment={apartment} className={"mr-auto"} />
            <h1 className="text-4xl">Venta y/o transferencia</h1>
            <FaArrowRight size={50}/>
          </div>
          <div className="flex relative">
            {!formIndex ? <Form fields={fields} onSubmit={onSubmit} register={register} className={"mr-auto !text-4xl px-16"}/> : null}
            {formIndex ? <Form fields={secondFields} className={"mr-auto !text-4xl px-16"}/> : null}
          </div>
        </section>
      ) : (
        <BounceLoader/>
      )}
    </Main>
  )
}

export default Transaction