import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa"
import { CiMail } from "react-icons/ci"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { UserContext } from "../context/userContext"
import Main from "../containers/Main"

const Login = () => {
  const [activeInput, setActiveInput] = useState()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState(null)
  const { setUser } = useContext(UserContext)
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  const inputClassName = "py-2 px-3 !outline-none text-4xl bg-transparent placeholder:text-fourth/70 duration-500 relative z-20"

  const onSubmit = handleSubmit(async data => {
    try {
      const res = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/session/login`, { method: "POST", credentials: "include", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } })).json()
      !res.payload ? setError(true) : (navigate("/"), setUser(true))
    } catch(e) {
      console.log(e)
      setError(true)
    }
  })

  return (
    <Main className={"pt-[200px] pb-[50px] items-center bg-gradient-to-tr from-indigo-500 from-30% via-sky-500 via-60% to-emerald-500 to-90% gap-y-[70px]"}>
      <form className="flex flex-col gap-y-[70px] bg-sixth items-center py-8 px-8" onSubmit={onSubmit}>
        <FaUserCircle className="text-fourth rounded-full" size={200} />
        <div className={`flex text-fourth gap-x-[40px] items-center border-b-4 duration-500`}>
          <CiMail className="text-5xl font-bold" />
          <div className={`relative after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:duration-300 after:bg-[#222]/10 after:content-[''] after:z-10 ${activeInput == "email" && "after:w-full"}`}>
            <input type="text" {...register("email")} placeholder={"Email"} className={inputClassName} onBlur={() => setActiveInput("")} onClick={() => setActiveInput("email")} />
          </div>
        </div>
        <div className={`flex text-fourth gap-x-[40px] items-center border-b-4 duration-500`}>
          {!passwordVisible ? <FaEyeSlash className="text-5xl" onClick={() => setPasswordVisible(true)} /> : <FaEye className="text-5xl" onClick={() => setPasswordVisible(false)} />}
          <div className={`relative after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:duration-300 after:bg-[#222]/10 after:content-[''] after:z-10 ${activeInput == "password" && "after:w-full"}`}>
            <input type={passwordVisible ? "text" : "password"} {...register("password")} placeholder={"Contraseña"} className={inputClassName} onBlur={() => setActiveInput("")} onClick={() => setActiveInput("password")} />
          </div>
        </div>
        <div className="flex flex-col gap-y-[30px] w-full">
          {error ? <p className="text-xl py-2 px-3 bg-red-500 text-fourth">Email o contraseña incorrectos</p> : null}
          <div className="flex w-full justify-between text-xl w-full">
            <p className="text-fourth">No tienes una cuenta?</p>
            <Link className="text-fourth duration-300 hover:text-cyan-300" to={"/register"}>Registrate</Link>
          </div>
          <input type="submit" value={"Iniciar sesion"} className="bg-blue-800 text-fourth text-4xl py-3 px-3 duration-300 hover:bg-blue-500" />
        </div>
      </form>
    </Main>
  )
}

export default Login