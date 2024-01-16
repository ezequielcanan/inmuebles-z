import Main from "../containers/Main"
import ProjectsSection from "../components/ProjectsSection"
import { Link } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { BounceLoader } from "react-spinners"
import { useEffect, useState } from "react"

const Projects = () => {
  const [projects, setProjects] = useState(false)
  const sections = ["De pozo", "En desarrollo", "Finalizados"]

  useEffect(() => {
    fetch(import.meta.env.VITE_REACT_API_URL + "/api/projects", {credentials: "include"})
      .then(res => res.json())
      .then(json => (setProjects(json.payload)))
  }, [])

  return (
    <Main className={"bg-sixth pt-[200px] pb-[100px] gap-y-[70px]"}>
      <section className="w-full flex justify-between">
        <h1 className="text-6xl font-black text-fourth">Todos los proyectos</h1>
        <Link to={"/new-project"} className="flex gap-x-[20px] rounded-lg items-center text-fourth bg-fifth py-4 px-5 text-3xl font-black">Nuevo Proyecto <FaPlus/></Link>
      </section>
      <>
        {projects.status ? (sections.map((s,i) => {
          return <ProjectsSection section={s} projects={projects[s]} key={i}/>
        })) : (
          <BounceLoader/>
        )}
      </>
    </Main>
  )
}

export default Projects