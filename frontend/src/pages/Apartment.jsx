import { useEffect, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { FaChevronLeft, FaFilePdf } from "react-icons/fa"
import { BounceLoader } from "react-spinners"
import { BiTransferAlt } from "react-icons/bi"
import Main from "../containers/Main"
import ApartmentInfoTable from "../components/ApartmentInfoTable"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const Apartment = () => {
  const { inmueble } = useParams()
  const location = useLocation()

  const [apartment, setApartment] = useState()
  const [info, setInfo] = useState()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [genereatePdf, setGeneratePdf] = useState(false)
  const [reload, setReload] = useState(false)
  let ulButtons = ["Titular", "Ficha", "Fotos", "Videos", "Plano", "Historial", "PDF", "Estado"]

  const onChangeFunction = (e, fileType = "photos", fileEndpoint = "file") => {
    setCarouselIndex(0)
    const imageForm = new FormData()
    imageForm.append("data", JSON.stringify({ folder: `projects/${apartment.project?._id || ""}/${apartment._id || ""}/${fileType}` }))
    imageForm.append("file", e.target.files[0])
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/" + fileEndpoint, { method: "POST", credentials: "include", body: imageForm }).then(res => res.json()).then(json => setReload(!reload))
  }
  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/" + inmueble, { credentials: "include" })
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

  const getApartmentPdf = () => {
    if (info == "Ficha") {
      setGeneratePdf(true)
      setTimeout(() => {
        const input = document.getElementById("pdf-input")
        html2canvas(input)
          .then(canvas => {
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF()
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            const canvasWidth = canvas.width * ratio;
            const canvasHeight = canvas.height * ratio;

            const marginX = (pageWidth - canvasWidth) / 2;
            const marginY = (pageHeight - canvasHeight) / 2;

            pdf.addImage(imgData, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);
            pdf.save(`${apartment?.unit || ""}.pdf`);
            setGeneratePdf(false)
          })
      }, 0)
    }
  }

  return (
    <Main className={"pt-[200px] items-center bg-sixth gap-y-[80px]"}>
      {apartment ? (
        <>
          <section className="flex w-full justify-between">
            <Link to={location?.state?.from || "/floors/" + apartment?.floor?._id}><FaChevronLeft className="text-6xl text-fourth" /></Link>
            <div className="flex flex-col items-center gap-y-[40px]">
              <h1 className="text-fourth text-6xl text-center font-bold">{apartment?.project?.title}</h1>
              <h2 className="text-fourth text-6xl text-center font-bold">UF: {apartment.unit}</h2>
            </div>
            <div className="flex gap-x-[30px]">
              <FaFilePdf className="text-6xl text-fourth cursor-pointer" onClick={getApartmentPdf} />
              <Link to={"./transaction"}><BiTransferAlt className="text-6xl text-fourth" /></Link>
            </div>
          </section>
          <section className="w-full h-full flex flex-col gap-y-[80px] p-24 items-center">
            <ul className="flex text-fourth text-4xl flex-wrap items-center justify-center">
              {apartment && ulButtons.map((button, i) => {
                return <li key={i} className={`px-8 py-6 duration-300 hover:bg-fourth/40 text-center border-4 `} onClick={() => handleSectionClick(button)}>{button}</li>
              })}
            </ul>
            {info && <ApartmentInfoTable info={info} apartment={apartment} reload={reload} onChangeFunction={onChangeFunction} carouselIndex={carouselIndex} generatePdf={genereatePdf} setCarouselIndex={setCarouselIndex} />}
          </section>
        </>
      ) : (
        <BounceLoader size={100} />
      )}
    </Main>
  )
}

export default Apartment