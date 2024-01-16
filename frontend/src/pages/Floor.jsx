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
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/floor/" + fid, {credentials: "include"})
      .then(res => res.json())
      .then(json => setFloor(json.payload))
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/apartments/floor/" + fid, {credentials: "include"})
      .then(res => res.json())
      .then(json => setApartments(json.payload))
  }, [])

  return (
    <Main className={"pt-[200px] pb-[100px] items-center mb-auto bg-sixth gap-y-[20px]"}>
      {floor ? (
        <>
          <section className="flex justify-between items-center w-full">
            <Link to={"/projects/" + floor.project}><FaChevronLeft className="text-6xl text-fourth" /></Link>
            <h1 className="text-fourth text-6xl">{floor.title}</h1>
            <Link to={"/floors/" + fid + "/edit"}><FaEdit className="text-6xl text-fourth" /></Link>
          </section>
          <section className="flex justify-evenly w-full items-center">
            <div className="flex items-center">
              <h2 className="text-fourth text-2xl py-2 px-4">Vendido</h2>
              <span className="w-[30px] h-[30px] bg-red-600"/>
            </div>
            <div className="flex items-center">
              <h2 className="text-fourth text-2xl py-2 px-4">En venta</h2>
              <span className="w-[30px] h-[30px] bg-fifth"/>
            </div>
            <div className="flex items-center">
              <h2 className="text-fourth text-2xl py-2 px-4">Alquilado</h2>
              <span className="w-[30px] h-[30px] bg-[#fcba03] rounded-full"/>
            </div>
          </section>
        </>
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