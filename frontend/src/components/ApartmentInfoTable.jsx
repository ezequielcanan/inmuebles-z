import { FaRegFilePdf, FaTrash, FaArrowRight } from "react-icons/fa"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Carousel from "./Carousel"

const ApartmentInfoTable = ({ info, apartment, onChangeFunction, carouselIndex, setCarouselIndex }) => {
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [plano, setPlano] = useState([])
  const [docs, setDocs] = useState([])
  const [transactions, setTransactions] = useState([])
  const navigate = useNavigate()

  const trClassName = `flex gap-x-[100px] py-5 px-7 ${apartment.forSale ? "bg-fifth" : "bg-red-500"} ${apartment.rent && "bg-[#fcba03]"} justify-between text-fourth text-4xl`
  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/files/photos?project=" + apartment?.project?._id + "&apartment=" + apartment._id).then(res => res.json()).then(json => setImages(json.payload || []))
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/files/videos?project=" + apartment?.project?._id + "&apartment=" + apartment._id).then(res => res.json()).then(json => setVideos(json.payload || []))
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/files/plano?project=" + apartment?.project?._id + "&apartment=" + apartment._id).then(res => res.json()).then(json => setPlano(json.payload || []))
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/files/docs?project=" + apartment?.project?._id + "&apartment=" + apartment._id).then(res => res.json()).then(json => setDocs(json.payload || []))
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/transaction/apartment/" + apartment?._id).then(res => res.json()).then(json => setTransactions(json.payload || []))
  }, [info])

  const fileTypes = {
    "Fotos": { fileType: "photos", setState: setImages },
    "Videos": { fileType: "videos", setState: setVideos },
    "Plano": { fileType: "plano", setState: setPlano },
    "PDF": { fileType: "docs", setState: setDocs }
  }

  const handleTrashClick = (image) => {
    const body = {
      project: apartment.project?._id,
      apartment: apartment?._id,
      file: image,
      fileType: fileTypes[info].fileType
    }

    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/apartments/files`, { method: "DELETE", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }).then(res => res.json()).then(json => fileTypes[info].setState(json.payload))
  }

  const infoSections = {
    "Titular": [
      { head: "Dueño:", value: apartment.owner?.name },
      { head: "Telefono:", value: apartment.owner?.number },
      { head: "Email:", value: apartment.owner?.email },
      { head: "Tipo de dueño:", value: apartment.owner?.ownerType },
    ],
    "Ficha": [
      { head: "Proyecto", value: apartment.project?.title },
      { head: "Ambientes", value: apartment.rooms },
      { head: "Orientacion", value: apartment.orientation },
      { head: "Metros cubiertos", value: apartment.meters?.covered },
      { head: "Metros descubiertos", value: apartment.meters?.uncovered },
      { head: "Metros balcon", value: apartment.meters?.balcony },
      { head: "Metros amenities", value: apartment.meters?.amenities },
      { head: "TOTALES", value: apartment.meters?.total },
      { head: "Precio total", value: apartment?.meters?.total * apartment?.price }
    ],
    "Inquilino": [
      { head: "Nombre", value: apartment.rent?.tenant?.tenantName },
      { head: "Telefono", value: apartment.rent?.tenant?.tenantNumber }
    ],
    "Historial": () => {
      let owners = []
      transactions && transactions.forEach(t => (owners.push(t.seller), owners.push(t.buyer)))
      owners = owners.filter((owner, i) => owners.indexOf(owner) == i)
      return (
        transactions ? (
          <div className="flex flex-col border-2 border-fourth overflow-hidden">
            {owners.map((owner, i) => {
              return <div key={i}  className="flex text-fourth gap-x-[30px] items-center bg-cyan-600 duration-300 hover:bg-second py-2 px-3 border-2 border-fourth">
                <FaArrowRight size={50} />
                <p className="text-4xl">{owner.name}</p>
              </div>
            })}
          </div>
        ) : null
      )
    },
    "Fotos": () => {
      return images.map((image, i) => {
        return <div className="w-full flex-shrink-0 relative" key={i}>
          <button className="absolute top-[5%] right-[5%] bg-first text-fourth rounded-full px-4 py-4" onClick={() => handleTrashClick(image)}>
            <FaTrash size={40} />
          </button>
          <img src={`${import.meta.env.VITE_REACT_API_URL}/static/projects/${apartment.project?._id}/${apartment._id}/photos/${image}`} key={i} className="object-cover h-full w-full" />
        </div>
      })
    },
    "Videos": () => {
      return videos.map((video, i) => {
        return <div className="w-full flex-shrink-0 relative" key={i}>
          <button className="absolute top-[5%] right-[5%] bg-first text-fourth rounded-full px-4 py-4 z-20" onClick={() => handleTrashClick(video)}>
            <FaTrash size={40} />
          </button>
          <video src={`${import.meta.env.VITE_REACT_API_URL}/static/projects/${apartment.project?._id}/${apartment._id}/videos/${video}`} controls />
        </div>
      })
    },
    "Plano": () => {
      return plano.map((image, i) => {
        return <div className="w-full flex-shrink-0 relative" key={i}>
          <button className="absolute top-[5%] right-[5%] bg-first text-fourth rounded-full px-4 py-4" onClick={() => handleTrashClick(image)}>
            <FaTrash size={40} />
          </button>
          <img src={`${import.meta.env.VITE_REACT_API_URL}/static/projects/${apartment.project?._id}/${apartment._id}/plano/${image}`} key={i} className="object-cover h-full w-full" />
        </div>
      })
    },
    "PDF": () => {
      return docs.map((pdf, i) => {
        return <div className="w-full flex-shrink-0 relative flex flex-col justify-center items-center" key={i}>
          <button className="absolute top-[5%] right-[5%] bg-first text-fourth rounded-full px-4 py-4" onClick={() => handleTrashClick(pdf)}>
            <FaTrash size={40} />
          </button>
          <a href={`${import.meta.env.VITE_REACT_API_URL}/static/projects/${apartment.project?._id}/${apartment._id}/docs/${pdf}`} target="_blank" key={i} className="object-cover h-full text-red-600 flex flex-col bg-fourth items-center px-4 justify-evenly rounded-lg cursor-pointer" download>
            <FaRegFilePdf size={100} />
            <h3 className="text-red-600 text-3xl">{pdf}</h3>
          </a>
        </div>
      })
    },
    "Estado": () => {
      transactions.length && navigate("/transaction/"+transactions[transactions.length - 1]?._id)
    }
  }
  return (
    (info != "Fotos" && info != "Plano" && info != "Videos" && info != "PDF" && info != "Historial" && info != "Estado") ? (
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
      info != "Historial" && info != "Estado" ? <Carousel state={carouselIndex} setState={setCarouselIndex} onChangeFunction={(e) => onChangeFunction(e, fileTypes[info].fileType)} fileType={info}>
        {infoSections[info]()}
      </Carousel> : (
        infoSections[info]()
      )
    )
  )
}

export default ApartmentInfoTable