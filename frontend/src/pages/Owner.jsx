import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Main from "../containers/Main"
import ApartmentCard from "../components/ApartmentCard"

const Owner = () => {
  const { owner } = useParams()
  const [apartments, setApartments] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/owner/apartments/${owner}`, {credentials: "include"}).then(res => res.json()).then(json => setApartments(json.payload))
  }, [])


  return (
    <Main className={"pt-[200px] items-center bg-sixth"}>
      {apartments.length ? (
        <div className="text-fourth flex flex-col gap-y-[40px] items-center">
          <h1 className="text-6xl font-black">{apartments[0]?.owner?.name}</h1>
          <h2 className="text-4xl">Departamentos totales: {apartments.length}</h2>
          <div className="flex w-full justify-evenly">
            {apartments.map((apartment,i) => {
              return <ApartmentCard apartment={apartment} key={i} previousPath={"/owners/"+owner}/>
            })}
          </div>
        </div>
      ) : null}
    </Main>
  )
}

export default Owner