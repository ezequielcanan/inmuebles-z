import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Main from "../containers/Main"
import ApartmentCard from "../components/ApartmentCard"
import { BounceLoader } from "react-spinners"

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
    <Main className={"pt-[200px] items-center bg-sixth"}>
      <section>
        {apartments ? (
          <>
            <div className="flex">
              {apartments.map(a => a.orientation == "Contrafrente" && <ApartmentCard apartment={a} key={a._id} />)}
            </div>
            <div className="flex">
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