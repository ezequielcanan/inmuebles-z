import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Main from "../containers/Main"
import { BounceLoader } from "react-spinners"
import ApartmentInfoTable from "../components/ApartmentInfoTable"

const Apartment = () => {
  const { inmueble } = useParams()
  const [apartment, setApartment] = useState()
  const [info, setInfo] = useState()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const ulButtons = ["Titular", "Ficha", "Fotos", "Videos", "Plano", "Historial", "Documentos"]

  const onChangeFunction = (e) => {
    setCarouselIndex(0)
    const imageForm = new FormData()
    imageForm.append("data", JSON.stringify({folder: `projects/${apartment.project?.title || ""}/${apartment._id || ""}/photos`}))
    imageForm.append("file", e.target.files[0])
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/photo", {method: "POST", body: imageForm}).then(res => res.json()).then(json => setInfo(""))
  }

  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/" + inmueble)
      .then(res => res.json())
      .then(json => (setApartment(json.payload), json?.payload?.rent && ulButtons.splice(4,0,"Inquilino")))
  }, [])

  const handleSectionClick = (section) => {
    info !== section && setInfo(section)
  }

  return (
    <Main className={"pt-[200px] items-center bg-sixth gap-y-[80px]"}>
      {apartment ? (
        <>
          <section className="flex flex-col gap-y-[40px]">
            <h1 className="text-fourth text-6xl text-center font-bold">{apartment?.project?.title}</h1>
            <h2 className="text-fourth text-6xl text-center font-bold">UF: {apartment.unit}</h2>
          </section>
          <section className="w-full h-full flex flex-col gap-y-[80px] p-24 items-center">
            <ul className="flex text-fourth text-4xl flex-wrap items-center justify-center">
              {ulButtons.map((button,i) => {
                return <li key={i} className={`px-8 py-6 duration-300 hover:bg-fourth/40 text-center border-4 `} onClick={() => handleSectionClick(button)}>{button}</li>
              })}
            </ul>
            {info && <ApartmentInfoTable info={info} apartment={apartment} onChangeFunction={onChangeFunction} carouselIndex={carouselIndex} setCarouselIndex={setCarouselIndex}/>}
          </section>
        </>
      ) : (
        <BounceLoader size={100} />
      )}
    </Main>
  )
}

export default Apartment