import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaPlus, FaChevronLeft, FaFileExcel, FaDollarSign } from "react-icons/fa"
import { Link } from "react-router-dom"
import Main from "../containers/Main"

const Project = () => {
  const [project, setProject] = useState(false)
  const [floors, setFloors] = useState([])
  const { project: pid } = useParams()
  useEffect(() => {
    fetch("http://localhost:3000/api/projects/" + pid, { credentials: "include" })
      .then(res => res.json())
      .then(json => setProject(json.payload))
  }, [])

  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/floor/project/" + pid, { credentials: "include" })
      .then(res => res.json())
      .then(json => setFloors(json.payload))
  }, [floors])

  const handleClick = () => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/floor/project/" + pid, { method: "POST", credentials: "include" })
      .then(res => res.json())
      .then(json => (setFloors(floors)))
  }

  return (
    <Main className={`pt-[200px] bg-sixth bg-blend-multiply items-center gap-y-[60px]`}>
      {!project ? (
        <BounceLoader />
      ) : (
        <>
          <section className="flex w-full justify-between items-center gap-y-[30px]">
            <Link to={"/projects/"}><FaChevronLeft className="text-6xl text-fourth" /></Link>
            <h1 className="text-6xl text-fourth font-black">{project.title}</h1>
            <div className="flex gap-x-[30px]">
              <a href={`${import.meta.env.VITE_REACT_API_URL}/api/transaction/excel/project/${pid}`}><FaDollarSign className="text-fourth text-6xl cursor-pointer" /></a>
              <a href={`${import.meta.env.VITE_REACT_API_URL}/api/projects/excel/${pid}`}><FaFileExcel className="text-fourth text-6xl cursor-pointer" /></a>
            </div>
          </section>
          <section className="grid grid-cols-4 gap-x-[70px] gap-y-[35px]">
            {floors.length ? floors.map(f => {
              return <Link to={`/floors/${f._id}`} className="text-fourth bg-[#444] flex flex-col h-[150px] w-[250px] shadow-xl shadow-[#000] duration-300 hover:scale-[1.1]" key={f.index}>
                <h3 className="text-3xl font-semibold border-b-2 border-fourth px-5 py-2 text-center">{f.title}</h3>
              </Link>
            }) : (
              null
            )}
            <div className="text-fourth py-8 px-8 h-[150px] w-[250px] bg-fourth/30 flex flex-col items-center justify-center border-4 border-dashed border-fourth" onClick={handleClick}>
              <FaPlus className="text-4xl" />
              <h3 className="text-2xl text-fourth">Agregar piso</h3>
            </div>
          </section>
        </>
      )}
    </Main>
  )
}

export default Project