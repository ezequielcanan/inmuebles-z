import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa"
import { CiMail, CiUser } from "react-icons/ci"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import Main from "../containers/Main"

const Register = () => {
  const [activeInput, setActiveInput] = useState()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const inputClassName = "py-2 px-3 !outline-none text-4xl bg-transparent placeholder:text-fourth/70 duration-500 relative z-20"

  const onSubmit = handleSubmit(async data => {
    try {
      const res = await (await fetch(`${import.meta.env.VITE_REACT_API_URL}/api/session/register`, { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } })).json()
      console.log(res)
      !res.payload ? setError(true) : (navigate("/login"))
    } catch (e) {
      setError(true)
    }
  })

  return (
    <Main className={"pt-[200px] pb-[50px] items-center bg-gradient-to-tr from-indigo-500 from-30% via-sky-500 via-60% to-emerald-500 to-90% gap-y-[70px]"}>
      <form className="flex flex-col gap-y-[40px] bg-sixth items-center py-8 px-8" onSubmit={onSubmit}>
        <FaUserCircle className="text-fourth rounded-full" size={200} />
        <div className={`flex text-fourth gap-x-[40px] items-center border-b-4 duration-500`}>
          <CiUser className="text-5xl font-bold" />
          <div className={`relative after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:duration-300 after:bg-[#222]/10 after:content-[''] after:z-10 ${activeInput == "name" && "after:w-full"}`}>
            <input type="text" {...register("name")} placeholder={"Nombre"} className={inputClassName} onBlur={() => setActiveInput("")} onClick={() => setActiveInput("name")} />
          </div>
        </div>
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
          {error ? <p className="text-xl py-2 px-3 bg-red-500 text-fourth">El usuario ya existe.</p> : null}
          <div className="flex w-full justify-between text-xl w-full">
            <p className="text-fourth">Ya tienes una cuenta?</p>
            <Link className="text-fourth duration-300 hover:text-cyan-300" to={"/login"}>Inicia sesion</Link>
          </div>
          <input type="submit" value={"Registrarse"} className="bg-blue-800 text-fourth text-4xl py-3 px-3 duration-300 hover:bg-blue-500" />
        </div>
      </form>
    </Main>
  )
}

export default Register