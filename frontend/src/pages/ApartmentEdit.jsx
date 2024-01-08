import { useEffect, useState } from "react"
import Form from "../components/Form"
import Main from "../containers/Main"
import { useParams } from "react-router-dom"

const ApartmentEdit = () => {
  const [apartment, setApartment] = useState(false)
  const { inmueble } =  useParams()

  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartment/" + inmueble)
  }, [])

  return (
    <Main className={"pt-[200px] items-center bg-sixth"}>

    </Main>
  )
}

export default ApartmentEdit