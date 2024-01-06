import { useState } from "react"
import Main from "../containers/Main"

const Apartment = () => {
  const [info, setInfo] = useState(false)
  
  const handleCategoryClick = (category) => {
    info == category ? setInfo(false) : setInfo(category)
  }

  const liClassName = "px-[25px] py-[20px] duration-300 hover:bg-third text-center"
  return (
    <Main className={"bg-sixth pt-[200px] text-fourth items-center"}>
      <h1 className="text-7xl">UF: 501</h1>
      <section className="w-full h-full flex flex-col items-center gap-y-[50px] mt-[50px] px-24">
        <ul className="border-4 rounded text-4xl text-center p-0 flex flex-row gap-y-[0px] justify-between">
          <li className={"px-[25px] py-[20px] duration-300 hover:bg-third"} onClick={() => handleCategoryClick("estado")}>Estado</li>
          <li className={liClassName}>Metros</li>
          <li className={liClassName}>Foto</li>
          <li className={liClassName}>Video</li>
          <li className={liClassName}>Plano</li>
          <li className={liClassName}>Inquilino</li>
          <li className={liClassName}>Historial</li>
          <li className="px-[25px] py-[20px] duration-300 hover:bg-third">Documentos</li>
        </ul>
        {info && (
          <table className="text-5xl bg-fourth h-full">
            <tbody className="flex flex-col gap-y-[3px]">
              <tr className="flex gap-x-[40px] py-5 px-7 bg-third">
                <td>Dueño:</td>
                <td className="w-full text-end">ARSA S.A.</td>
              </tr>
              <tr className="flex gap-x-[40px] py-5 px-7 bg-third">
                <td>Estado:</td>
                <td className="w-full text-end">Vendido</td>
              </tr>
              <tr className="flex gap-x-[40px] py-5 px-7 bg-third">
                <td>Alquilado:</td>
                <td className="w-full text-end">No</td>
              </tr>
              <tr className="flex gap-x-[40px] py-5 px-7 bg-third">
                <td>Estado:</td>
                <td className="w-full text-end">En venta y alquilado</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
    </Main>
  )
}

export default Apartment