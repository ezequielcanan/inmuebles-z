import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import Main from "../containers/Main"
import FormInput from "../components/FormInput"
import { FaChevronLeft } from "react-icons/fa"

const Statistics = () => {
  const { project: pid } = useParams()
  const [statistics, setStatistics] = useState()
  const [info, setInfo] = useState()
  const location = useLocation()
  const {pathname} = location

  const trClassName = `flex gap-x-[100px] py-5 px-7 justify-between text-fourth text-4xl bg-gradient-to-r from-red-500 from-50% to-fifth to-50%`

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/projects/rooms/Monoambiente/${pid}`, { credentials: "include" }).then(res => res.json()).then(json => setStatistics(json.payload[0]))
  }, [])

  const onChangeRooms = async (value) => {
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/projects/rooms/${value}/${pid}`, { credentials: "include" })).json()
    setInfo(value)
    setStatistics(result.payload[0])
  }

  const getTotalMeters = async () => {
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/projects/meters/${pid}`, { credentials: "include" })).json()
    setInfo("Metros totales")
    setStatistics(result.payload[0])
  }

  const getTotalUf = async () => {
    const result = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/projects/units/${pid}`, { credentials: "include" })).json()
    setInfo("Unidades totales")
    setStatistics(result.payload[0])
  }

  return (
    <Main className={"bg-sixth pt-[200px] items-center gap-y-[70px]"}>
      <section className="flex w-full">
        <Link to={pathname.substring(0, pathname.lastIndexOf('/'))} className="mr-auto"><FaChevronLeft className="text-6xl text-fourth"/></Link>
        <h1 className="text-6xl text-fourth mr-auto">Estadisticas de ventas</h1>
      </section>
      <section className="flex flex-col items-center gap-y-[100px]">
        <ul className="flex text-fourth text-4xl flex-wrap items-center justify-center">
          <li className={`px-8 py-6 duration-300 hover:bg-fourth/40 text-center border-4`} onClick={getTotalUf}>Unidades totales</li>
          <li className={`px-8 py-6 duration-300 hover:bg-fourth/40 text-center border-4`} onClick={getTotalMeters}>Metros totales</li>
          <li className={`duration-300 hover:bg-fourth/40 text-center border-4`}><FormInput field={
            {
              type: "select",
              options: [
                "Monoambiente",
                "2 ambientes",
                "3 ambientes",
                "4 ambientes",
                "5 ambientes",
                "Local"
              ],
              className: "w-full h-full px-8 py-6",
              onChange: (e) => onChangeRooms(e.target.value),
              onClick: (e) => onChangeRooms(e.target.value)
            }} /></li>
        </ul>
        {info ? (
          <div className="flex flex-col gap-y-[40px]">
            <h2 className="text-4xl text-fourth text-center">{info}</h2>
            <table className="border-4" id="pdf-input">
              <tbody className="flex flex-col gap-y-[3px] bg-fourth">
                <tr className={trClassName}>
                  <td className="bg-red-500 text-center w-[50%]">Vendidos</td>
                  <td className="bg-fifth text-center w-[50%]">Disponibles</td>
                </tr>
                <tr className={trClassName}>
                  <td className="bg-red-500 text-center text-6xl w-[50%]">{statistics?.vendidos[0]?.count || 0}</td>
                  <td className="bg-fifth text-center text-6xl w-[50%]">{statistics?.disponibles[0]?.count || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </Main>
  )
}

export default Statistics