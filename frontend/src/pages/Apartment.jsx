import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { FaChevronLeft } from "react-icons/fa"
import { BounceLoader } from "react-spinners"
import {BiTransferAlt} from "react-icons/bi"
import Main from "../containers/Main"
import ApartmentInfoTable from "../components/ApartmentInfoTable"

const Apartment = () => {
  const { inmueble } = useParams()
  const [apartment, setApartment] = useState()
  const [info, setInfo] = useState()
  const [carouselIndex, setCarouselIndex] = useState(0)
  let ulButtons = ["Titular", "Ficha", "Fotos", "Videos", "Plano", "Historial", "PDF"]

  const onChangeFunction = (e, fileType = "photos", fileEndpoint = "file") => {
    setCarouselIndex(0)
    const imageForm = new FormData()
    imageForm.append("data", JSON.stringify({ folder: `projects/${apartment.project?._id || ""}/${apartment._id || ""}/${fileType}` }))
    imageForm.append("file", e.target.files[0])
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/" + fileEndpoint, { method: "POST", body: imageForm }).then(res => res.json()).then(json => setInfo(""))
  }
  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/" + inmueble)
      .then(res => res.json())
      .then(json => {
        setApartment(json.payload)
      })
  }, [])

  apartment?.rent && (ulButtons = [...ulButtons, "Inquilino"])

  const handleSectionClick = (section) => {
    setCarouselIndex(0)
    info !== section && setInfo(section)
  }

  return (
    <Main className={"pt-[200px] items-center bg-sixth gap-y-[80px]"}>
      {apartment ? (
        <>
          <section className="flex w-full justify-between">
            <Link to={"/floors/" + apartment?.floor?._id}><FaChevronLeft className="text-6xl text-fourth" /></Link>
            <div className="flex flex-col items-center gap-y-[40px]">
              <h1 className="text-fourth text-6xl text-center font-bold">{apartment?.project?.title}</h1>
              <h2 className="text-fourth text-6xl text-center font-bold">UF: {apartment.unit}</h2>
            </div>
            <Link to={"./transaction"}><BiTransferAlt className="text-6xl text-fourth"/></Link>
          </section>
          <section className="w-full h-full flex flex-col gap-y-[80px] p-24 items-center">
            <ul className="flex text-fourth text-4xl flex-wrap items-center justify-center">
              {apartment && ulButtons.map((button, i) => {
                return <li key={i} className={`px-8 py-6 duration-300 hover:bg-fourth/40 text-center border-4 `} onClick={() => handleSectionClick(button)}>{button}</li>
              })}
            </ul>
            {info && <ApartmentInfoTable info={info} apartment={apartment} onChangeFunction={onChangeFunction} carouselIndex={carouselIndex} setCarouselIndex={setCarouselIndex} />}
          </section>
        </>
      ) : (
        <BounceLoader size={100} />
      )}
    </Main>
  )
}

export default Apartment