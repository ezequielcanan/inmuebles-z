import { Link } from "react-router-dom"
import { GoArrowRight } from "react-icons/go"
import Main from "../containers/Main"

const Home = () => {
  return (
    <Main className="bg-[url('render.jpeg')] bg-first/65 bg-left bg-no-repeat bg-cover bg-top bg-blend-multiply justify-center items-center pt-[100px]">
      <section className="flex flex-col items-start">
        <h1 className="nav-title text-7xl font-black mb-[40px]">Desarrollos &<br/> proyectos</h1>
        <p className="text-fourth text-3xl">Aplicación para manejo de desarrollos inmobiliarios</p>
        <Link to={"/projects"} className="px-6 py-4 bg-second text-fourth rounded text-3xl font-black mt-[120px] flex items-center gap-x-[30px] z-10 relative duration-300 after:absolute after:top-0 after:left-0 after:w-0 after:h-full after:duration-300 after:bg-first after:content-[''] after:-z-10 after:rounded hover:after:w-full">Proyectos <GoArrowRight className="animate-pulse stroke-[2px]"/></Link>
      </section>
    </Main>
  )
}

export default Home