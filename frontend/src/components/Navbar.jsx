import { Link } from "react-router-dom"
import NavLi from "./NavLi"

const Navbar = () => {
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

  return (
    <header className="w-full h-[120px] bg-first fixed z-50">
      <nav className="w-full h-full flex items-center justify-between px-20">
        <Link to={"/"}>
          <img src="/logo.svg" alt="" />
        </Link>
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