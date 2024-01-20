import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaPlus, FaChevronLeft, FaFileExcel, FaDollarSign, FaTrashAlt, FaPlusCircle } from "react-icons/fa"
import { Link } from "react-router-dom"
import Main from "../containers/Main"

const Project = () => {
  const [project, setProject] = useState(false)
  const [floors, setFloors] = useState([])
  const [apartments, setApartments] = useState([])
  const [reload, setReload] = useState(false)
  const navigate = useNavigate()
  const { project: pid } = useParams()
  useEffect(() => {
    fetch("http://localhost:3000/api/projects/" + pid, { credentials: "include" })
      .then(res => res.json())
      .then(json => setProject(json?.payload))
  }, [reload])

  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/floor/project/" + pid, { credentials: "include" })
      .then(res => res.json())
      .then(json => setFloors(json?.payload))
  }, [reload])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/apartments/project/${pid}`, { credentials: "include" })
      .then(res => res.json())
      .then(json => setApartments(json?.payload || []))
  }, [reload])

  const deleteFloor = async (e, id) => {
    await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/floor/${id}`, { credentials: "include", method: "DELETE" })
    setReload(!reload)
    navigate(".")
  }

  const handleClick = () => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/floor/project/" + pid, { method: "POST", credentials: "include" })
      .then(res => res.json())
      .then(json => (setReload(!reload)))
  }


  return (
    <Main className={`pt-[200px] bg-sixth bg-blend-multiply items-center gap-y-[60px]`}>
      {(!project && !apartments && !floors) ? (
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
              const areApartments = apartments.filter((apartment, i) => {
                return apartment?.floor?._id == f._id
              }).length
              console.log(areApartments)
              return <div className="relative duration-300 hover:scale-[1.1] bg-indigo-500 text-fourth border-emerald-500 border-[8px] rounded">
                <Link to={`/floors/${f._id}${!areApartments ? "/edit" : ""}`} className="flex flex-col h-[150px] w-[250px]" key={f.index}>
                  <h3 className="text-3xl font-semibold border-b-2 border-fourth px-5 py-2 text-center">{f.title}</h3>
                  <div className="flex w-full h-full items-center justify-evenly">
                    <FaPlusCircle size={40} />
                  </div>
                </Link>
                {(!areApartments && (
                  <FaTrashAlt className="absolute top-[10px] right-[10px] duration-300 hover:text-third" size={25} onClick={(e) => deleteFloor(e, f._id)} />
                ))}
              </div>
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