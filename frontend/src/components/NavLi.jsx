import { Link } from "react-router-dom"

const NavLi = ({text, path}) => {
  return(
    <li className="p-0">
      <Link to={path} className="px-4 py-2 z-10 relative duration-300 after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:duration-300 after:bg-second after:content-[''] after:-z-10 hover:after:w-full">{text}</Link>
    </li>
  )

}

export default NavLi