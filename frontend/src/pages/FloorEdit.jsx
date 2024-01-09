import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaPlus } from "react-icons/fa"
import { BounceLoader } from "react-spinners"
import { Link } from "react-router-dom"
import Main from "../containers/Main"


const FloorEdit = () => {
  const [floor, setFloor] = useState(false)
  const [apartments, setApartments] = useState(false)
  const { floor: fid } = useParams()

  const handleClick = () => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments", { method: "POST", body: JSON.stringify({ project: floor.project, floor: floor._id }), headers: { "Content-Type": "application/json" } })
      .then(res => res.json())
      .then(json => setApartments(apartments))
  }

  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/floor/" + fid)
      .then(res => res.json())
      .then(json => setFloor(json.payload))
  }, [])

  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/floor/" + fid)
      .then(res => res.json())
      .then(json => setApartments(json.payload))
  }, [apartments])

  return (
    <Main className={"pt-[200px] bg-sixth items-center gap-y-[100px]"}>
      {floor && (
        <h1 className="text-6xl text-fourth">{floor.title.toUpperCase()}</h1>
      )}
      <section className="grid grid-cols-6 gap-x-[50px] gap-y-[30px]">
        {apartments ? (apartments.map((a,i) => {
          return <Link key={i} to={`/inmueble/${a._id}/edit`} className="text-fourth py-8 px-8 h-[250px] w-[150px] bg-[#444] flex flex-col items-center justify-center">
            <h3 className="text-2xl text-fourth text-center">{a.unit}</h3>
          </Link>
        })) : (
          <BounceLoader/>
        )}
        <div className="text-fourth py-8 px-8 h-[250px] w-[150px] bg-fourth/30 flex flex-col items-center justify-center border-4 border-dashed border-fourth" onClick={handleClick}>
          <FaPlus className="text-4xl" />
          <h3 className="text-2xl text-fourth text-center">Agregar inmueble</h3>
        </div>
      </section>
    </Main>
  )
}

export default FloorEdit