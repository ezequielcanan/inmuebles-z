import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BounceLoader } from "react-spinners"
import { FaChevronLeft, FaEdit } from "react-icons/fa"
import Main from "../containers/Main"
import ApartmentCard from "../components/ApartmentCard"

const Floor = () => {
  const [floor, setFloor] = useState()
  const [apartments, setApartments] = useState()
  const { floor: fid } = useParams()


  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/floor/" + fid)
      .then(res => res.json())
      .then(json => setFloor(json.payload))
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/floor/" + fid)
      .then(res => res.json())
      .then(json => setApartments(json.payload))
  }, [])

  return (
    <Main className={"pt-[200px] items-center mb-auto bg-sixth "}>
      {floor ? (
        <section className="flex justify-between items-center w-full">
          <Link to={"/projects/"+floor.project}><FaChevronLeft className="text-6xl text-fourth"/></Link>
          <h1 className="text-fourth text-6xl">{floor.title}</h1> 
          <Link to={"/floors/"+fid+"/edit"}><FaEdit className="text-6xl text-fourth"/></Link>
        </section>
      ) : null}
      <section className="flex flex-col gap-y-[50px] my-auto">
        {apartments ? (
          <>
            <div className="flex gap-x-[20px]">
              {apartments.map(a => a.orientation == "Contrafrente" && <ApartmentCard apartment={a} key={a._id} />)}
            </div>
            <div className="flex gap-x-[20px]">
              {apartments.map(a => a.orientation == "Frente" && <ApartmentCard apartment={a} key={a._id} />)}
            </div>
          </>
        ) : (
          <BounceLoader />
        )}
      </section>
    </Main>
  )
}

export default Floor