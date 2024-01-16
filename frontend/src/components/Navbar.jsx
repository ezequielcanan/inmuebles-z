import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { FaUserCircle } from "react-icons/fa"
import {FiLogOut} from "react-icons/fi"
import { UserContext } from "../context/userContext"
import Cookies from "js-cookie"
import NavLi from "./NavLi"

const Navbar = ({ type }) => {
  const [owners, setOwners] = useState([])
  const [focus, setFocus] = useState(false)
  const [input, setInput] = useState("")
  const [user, setUser] = useState({})
  const [viewUser, setViewUser] = useState(false)
  const {user: userStateContext, setUser: logout} = useContext(UserContext)
  const navigate = useNavigate()


  const onClickViewUser = () => {
    setViewUser(!viewUser)
  }

  const buttons = type == "default" ? [
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
  ] : [
    {
      path: "/login",
      text: "Iniciar sesion"
    },
    {
      path: "/register",
      text: "Registrarse"
    },
  ]

  useEffect(() => {
    type == "default" && fetch(`${import.meta.env.VITE_REACT_API_URL}/api/session/auth`, { credentials: "include" }).then(res => res.json()).then(json => setUser(json.payload))
  }, [userStateContext])

  const handleChange = async (e) => {
    setInput(e.target.value)
    const owners = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/owner/?query=${e.target.value}`, {credentials:"include"})).json()
    setOwners(owners.payload || [])
  }

  return (
    <header className="w-full h-[120px] bg-first fixed z-50">
      <nav className="w-full h-full flex items-center justify-between px-20">
        <Link to={"/"}>
          <img src="/logo.svg" alt="" />
        </Link>
        {(type == "default" && user)? (
          <>
            <div className="flex gap-x-[20px] relative items-center">
              <input type="text" className="outline-none text-2xl px-2 py-1 rounded duration-200 focus:shadow-lg focus:shadow-third w-[200px]" onChange={handleChange} onFocus={() => setFocus(true)} onBlur={(e) => !e?.relatedTarget?.className?.includes("owner") && setFocus(false)} />
              {(focus && input) && ((owners.length) ? (
                <div className="absolute w-[250px] flex flex-col text-xl top-[100%] right-0 bg-second shadow-lg shadow-first text-fourth">
                  {owners.map((o, i) => {
                    return <Link reloadDocument to={`/owners/${o._id}`} className="h-full w-full px-3 py-3 duration-300 hover:bg-third cursor-pointer owner" key={i} onClick={() => (setFocus(false))}>
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
            {user.role == "admin" ? (
              <Link to={"/admin"} className="text-2xl text-fourth duration-300 hover:text-third">Administrar usuarios</Link>
            ) : null}
            <div className="flex h-full items-center gap-x-[40px] relative">
              <p className="text-fourth text-2xl">{user?.name}</p>
              <FaUserCircle size={40} className="text-fourth !outline-none" tabIndex={0} onBlur={() => setTimeout(() => setViewUser(false), 150)} onClick={onClickViewUser}/>
              {viewUser && (
                <div className="absolute top-[75%] bg-fourth duration-300 hover:bg-[#ddd] text-xl flex items-center justify-between gap-x-[20px] py-3 rounded px-4" onClick={() => (setViewUser(false), Cookies.set("jwt", ""), logout(""), navigate("/"))}>
                  <button>Cerrar sesion</button>
                  <FiLogOut/>
                </div>
              )}
            </div>
          </>
        ) : (
            <ul className="flex justify-between text-fourth text-xl gap-x-[70px]">
              {buttons.map((b, i) => {
                return <NavLi text={b.text} path={b.path} key={i} />
              })}
            </ul>
        )}
      </nav>
    </header>
  )
}

export default Navbar