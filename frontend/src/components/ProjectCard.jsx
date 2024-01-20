import { Link } from "react-router-dom"
import { FaPenAlt } from "react-icons/fa"

const ProjectCard = ({ title, thumbnail, path }) => {
  return (
    <div className="relative">
      <Link to={path} className={`flex flex-col relative shadow-xl shadow-[#000] z-10 w-[400px] h-[320px] bg-right bg-cover flex justify-center duration-500 justify-content-center hover:brightness-[40%] project-card`}>
        <div className="absolute z-20 top-0 w-full h-[80px] flex items-center justify-center text-3xl font-bold bg-first/50 text-fourth px-3">
          <h3 className="mx-auto flex items-center justify-center">{title}</h3>
        </div>
        <img src={`${import.meta.env.VITE_REACT_API_URL}/static/${thumbnail}`} alt="" className="object-cover w-full h-full absolute z-0 bg-blend-multiply bg-first/80" />
      </Link>
      <Link to={`/projects/${path}/edit`} className="absolute z-30 text-fourth top-7 cursor-pointer right-7">
        <FaPenAlt size={30} />
      </Link>
    </div>
  )
}

export default ProjectCard