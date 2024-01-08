import { Link } from "react-router-dom"

const ProjectCard = ({title, thumbnail, path}) => {
  return (
    <Link to={path} className={`flex flex-col relative shadow-xl shadow-[#000] z-10 w-[400px] h-[320px] bg-right bg-cover flex justify-center duration-500 justify-content-center hover:brightness-[40%]`}>
      <h3 className="absolute z-20 top-0 w-full h-[80px] text-fourth text-3xl font-bold flex items-center justify-center bg-first/50">{title}</h3>
      <img src={`${import.meta.env.VITE_REACT_API_URL}/static/${thumbnail}`} alt="" className="object-cover w-full h-full absolute z-0 bg-blend-multiply bg-first/80"/>
    </Link>
  )
}

export default ProjectCard