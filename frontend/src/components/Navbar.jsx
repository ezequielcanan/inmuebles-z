import { Link } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { useState } from "react"
import NavLi from "./NavLi"

const Navbar = () => {
  const [owners,setOwners] = useState([])
  const [focus, setFocus] = useState(false)
  const [input, setInput] = useState("")

  const buttons = [
    {
      path: "/",
      text: "De pozo"
    },
    {
      path: "/",
      text: "En desarrollo"
    },
    {
      path: "/",
      text: "Finalizados"
    }
  ]

  const handleChange = async (e) => {
    setInput(e.target.value)
    const owners = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/owner/?query=${e.target.value}`)).json()
    setOwners(owners.payload || [])
  }

  return (
    <header className="w-full h-[120px] bg-first fixed z-50">
      <nav className="w-full h-full flex items-center justify-between px-20">
        <Link to={"/"}>
          <img src="/logo.svg" alt="" />
        </Link>
        <div className="flex gap-x-[20px] relative items-center">
          <FaSearch className="text-third" size={30}/>
          <input type="text" className="outline-none text-2xl px-4 py-2 rounded duration-200 focus:shadow-lg focus:shadow-third w-[250px]" onChange={handleChange} onFocus={() => setFocus(true)} onBlur={(e) => !e?.relatedTarget?.className?.includes("owner") && setFocus(false) }/>
          {(focus && input) && ((owners.length) ? (
            <div className="absolute w-[250px] flex flex-col text-xl top-[100%] right-0 bg-second shadow-lg shadow-first text-fourth">
              {owners.map((o,i) => {
                return <Link to={`/owners/${o._id}`} className="h-full w-full px-3 py-3 duration-300 hover:bg-third cursor-pointer owner" key={i} onClick={() => setFocus(false)}>
                  <p>{o.name}</p>
                </Link>
              })}
            </div>
          ) : (
            <div className="absolute w-[250px] text-xl top-[100%] shadow-lg shadow-first right-0 bg-second text-fourth px-3 py-3">
              <p>No hay resultados</p>
            </div>
          ))}
        </div>
        <ul className="flex justify-between text-fourth text-2xl gap-x-[70px]">
          {buttons.map((b, i) => {
            return <NavLi text={b.text} path={b.path} key={i} />
          })}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar