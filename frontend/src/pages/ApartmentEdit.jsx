import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import Form from "../components/Form"
import Main from "../containers/Main"

const ApartmentEdit = () => {
  const { inmueble } = useParams()
  const [form, setForm] = useState(0)
  const [apartment, setApartment] = useState(false)
  const [rented, setRented] = useState(false)
  const [uf,setUf] = useState("")
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()


  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/" + inmueble)
      .then(res => res.json())
      .then(json => (setApartment(json.payload), setRented(json.payload.rent ? true : false)))
  }, [])

  const onSubmit = handleSubmit(async data => {
    const apartmentData = {"unit": data.unit, "forSale": data.forSale, "meters": {covered: data.covered, uncovered: data.uncovered, balcony: data.balcony, amenities: data.amenities, total: Number(data.covered) + Number(data.uncovered) + Number(data.balcony) + Number(data.amenities)}, "rooms": data.rooms, "orientation": data.orientation}
    const ownerData = {"name": data.name, "number": data.number || "", "email": data.email || "", "ownerType": data.ownerType}
    
    if (data.rented) {
      const tenantData = {"tenantName": data.tenantName, "tenantNumber": data.tenantNumber}
      apartment?.rent?.tenant?._id && (tenantData._id = apartment?.rent?.tenant?._id)
      const rentData = {"apartment": inmueble, "fromDate": data.fromDate, "toDate": data.toDate, "intermediary": data.intermediary}

      const {payload: tenant} = await(await fetch(import.meta.env.VITE_REACT_API_URL+"/api/tenant", {method: "POST", body: JSON.stringify(tenantData), headers: {"Content-Type": "application/json"}})).json()
      console.log(tenant)
      rentData.tenant = tenant._id

      const {payload: rent} = await(await fetch(import.meta.env.VITE_REACT_API_URL+"/api/rent", {method: "POST", body: JSON.stringify(rentData), headers: {"Content-Type": "application/json"}})).json()
      const {payload: owner} = await(await fetch(import.meta.env.VITE_REACT_API_URL+"/api/owner", {method: "POST", body: JSON.stringify(ownerData), headers: {"Content-Type": "application/json"}})).json()
      apartmentData.owner = owner._id
      apartmentData.rent = rent._id
      const {payload: apartmentRes} = await(await fetch(import.meta.env.VITE_REACT_API_URL+"/api/apartments/"+inmueble, {method: "PUT", body: JSON.stringify(apartmentData), headers: {"Content-Type": "application/json"}})).json()
      navigate("/floors/"+apartmentRes.floor)
    } else {
      const {payload: owner} = await(await fetch(import.meta.env.VITE_REACT_API_URL+"/api/owner", {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(ownerData)})).json()
      apartmentData.owner = owner._id
      const {payload: apartmentRes} = await(await fetch(import.meta.env.VITE_REACT_API_URL+"/api/apartments/"+inmueble, {method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify(apartmentData)})).json()
      navigate("/floors/"+apartmentRes.floor)
    }
  })

  const prev = () => {
    setForm((form) => !form ? 2 : form - 1)
  }

  const next = () => {
    setForm((form) => form == 2 ? 0 : form + 1)
  }

  const fields = [
    {
      type: "text",
      name: "unit",
      label: "UNIDAD FUNCIONAL:",
      className: "justify-self-center w-1/6",
      value: apartment?.unit || "",
      stateFunc: setUf
    },
    {
      type: "select",
      name: "rooms",
      label: "Ambientes:",
      options: [
        "Monoambiente",
        "2 ambientes",
        "3 ambientes",
        "4 ambientes",
        "5 ambientes",
        "Local"
      ],
      value: apartment?.rooms || "",
    },
    {
      type: "select",
      name: "orientation",
      label: "Orientacion:",
      options: ["Frente", "Contrafrente", "Izquierda", "Derecha"],
      value: apartment?.orientation || "",
    },
    {
      type: "text",
      name: "covered",
      label: "Metros cubiertos:",
      className: "w-[250px]",
      value: apartment?.meters?.covered || 0,
    },
    {
      type: "text",
      name: "balcony",
      label: "Metros balcon:",
      className: "w-[250px]",
      value: apartment?.meters?.balcony || 0,
    },
    {
      type: "text",
      name: "uncovered",
      label: "Metros descubiertos:",
      className: "w-[250px]",
      value: apartment?.meters?.uncovered || 0,
    },
    {
      type: "text",
      name: "amenities",
      label: "Metros amenities:",
      className: "w-[250px]",
      value: apartment?.meters?.amenities || 0,
    }
  ]

  const secondFields = [
    {
      type: "text",
      name: "name",
      label: "Nombre del titular:",
      value: apartment?.owner?.name || "",
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
      value: apartment?.owner?.ownerType || "Particular",
    },
    {
      type: "text",
      name: "number",
      label: "Numero de telefono:",
      value: apartment?.owner?.number || "",
    },
    {
      type: "text",
      name: "email",
      label: "Email:",
      value: apartment?.owner?.email || "",
    },
    {
      type: "checkbox",
      name: "forSale",
      multiOptions: true,
      label: "Disponible para la venta: ",
      value: apartment?.forSale || "",
    },
  ]
  
  let thirdFields = [
    {
      type: "checkbox",
      name: "rented",
      multiOptions: true,
      label: "Alquilado",
      value: apartment.rent,
      stateFunc: (checked) => setRented(checked ? true : false)
    }
  ]

  const getDate = (datetime) => {
    return datetime?.slice(0,10) || ""
  }

  rented && (thirdFields = [...thirdFields, {
    type: "text",
    name: "intermediary",
    label: "Intermediario:",
    value: apartment?.rent?.intermediary || "",
  },
  {
    type: "text",
    name: "tenantName",
    label: "Nombre del inquilino:",
    value: apartment?.rent?.tenant?.tenantName || "",
  },
  {
    type: "text",
    name: "tenantNumber",
    label: "Telefono del inquilino:",
    value: apartment?.rent?.tenant?.tenantNumber || "",
  },
  {
    type: "date",
    name: "fromDate",
    label: "Fecha de inicio:",
    value: getDate(apartment?.rent?.fromDate) || "",
  },
  {
    type: "date",
    name: "toDate",
    label: "Fecha de vencimiento:",
    value: getDate(apartment?.rent?.toDate) || "",
  },
  ])

  return (
    <Main className={"pt-[200px] pb-[100px] bg-sixth gap-y-[100px] items-center"}>
      {apartment && <>
        <div>
          <h1 className="text-6xl text-fourth text-center">{apartment.floor.title}</h1>
          <h2 className="text-6xl text-fourth mt-[50px] text-center">UF: {uf}</h2>
        </div>
        <div className="flex justify-center relative">
          {!form ? <Form fields={fields} register={register} enter={false}/> : null}
          {form == 1 ? <Form fields={secondFields} register={register} enter={false} /> : null}
          {form == 2 ? <Form fields={thirdFields} register={register} className="" onSubmit={onSubmit}/> : null}
          {form ? <FaChevronLeft size={50} className="absolute top-[50%] left-[-120px] text-fourth cursor-pointer" onClick={prev}/> : null}
          {form < 2 ? <FaChevronRight size={50} className="absolute top-[50%] right-[-120px] text-fourth cursor-pointer" onClick={next}/> : null}
        </div>
      </>}
    </Main>
  )
}

export default ApartmentEdit