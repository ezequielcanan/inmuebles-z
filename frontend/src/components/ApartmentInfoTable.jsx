import { FaImage, FaTrash } from "react-icons/fa"
import Carousel from "./Carousel"
import { useEffect, useState } from "react"

const ApartmentInfoTable = ({ info, apartment, onChangeFunction, carouselIndex, setCarouselIndex }) => {
  const [images, setImages] = useState([])
  const trClassName = `flex gap-x-[100px] py-5 px-7 ${apartment.forSale ? "bg-fifth" : "bg-red-500"} justify-between text-fourth text-4xl`
  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/files/photos/?project=" + apartment?.project?.title + "&apartment=" + apartment._id).then(res => res.json()).then(json => setImages(json.payload || []))
  }, [info])

  const fileTypes = {
    "Fotos": "photos"
  }

  const handleTrashClick = (image) => {
    const body = {
      project: apartment.project?.title,
      apartment: apartment?._id,
      file: image,
      fileType: fileTypes[info]
    }

    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/apartments/files`, {method: "DELETE", body: JSON.stringify(body), headers: {"Content-Type": "application/json"}}).then(res => res.json()).then(json => setImages(json.payload))
  }

  const infoSections = {
    "Titular": [
      { head: "Dueño:", value: apartment.owner?.name },
      { head: "Telefono:", value: apartment.owner?.number },
      { head: "Email:", value: apartment.owner?.email },
      { head: "Tipo de dueño:", value: apartment.owner?.ownerType },
    ],
    "Ficha": [
      { head: "Projecto", value: apartment.project?.title },
      { head: "Ambientes", value: apartment.rooms },
      { head: "Orientacion", value: apartment.orientation },
      { head: "Metros cubiertos", value: apartment.meters?.covered },
      { head: "Metros descubiertos", value: apartment.meters?.uncovered },
      { head: "Metros balcon", value: apartment.meters?.balcony },
      { head: "Metros amenities", value: apartment.meters?.amenities },
      { head: "Metros totales", value: apartment.meters?.total }]

  }
  return (
    (info != "Fotos" && info != "Plano" && info != "Videos" && info != "Documentos") ? (
      <table className="border-4">
        <tbody className="flex flex-col gap-y-[3px] bg-fourth">
          {infoSections[info].map(row => {
            return <tr key={row.head} className={trClassName}>
              <td>{row.head}</td>
              <td>{row.value}</td>
            </tr>
          })}
        </tbody>
      </table>
    ) : (
      (info == "Fotos") && (
        <Carousel state={carouselIndex} setState={setCarouselIndex} onChangeFunction={onChangeFunction}>
          {images.map((image, i) => {
            return <div className="w-full flex-shrink-0 relative">
              <button className="absolute top-[5%] right-[5%] bg-first text-fourth rounded-full px-4 py-4" onClick={() => handleTrashClick(image)}>
                <FaTrash size={40}/>
              </button>
              <img src={`${import.meta.env.VITE_REACT_API_URL}/static/projects/${apartment.project?.title}/${apartment._id}/photos/${image}`} key={i} className="object-cover h-full w-full" />
            </div>
          })}
        </Carousel>
      )
    )
  )
}

export default ApartmentInfoTable