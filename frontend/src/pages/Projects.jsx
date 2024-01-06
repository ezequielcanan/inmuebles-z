import { Link } from "react-router-dom"
import Main from "../containers/Main"
import { FaPlus } from "react-icons/fa"

const Projects = () => {
  return (
    <Main className={"bg-sixth pt-[200px] pb-[100px] gap-y-[70px]"}>
      <section className="w-full flex justify-between">
        <h1 className="text-6xl font-black text-fourth">Todos los proyectos</h1>
        <button className="flex gap-x-[20px] rounded-lg items-center text-fourth bg-fifth py-4 px-5 text-3xl font-black">Nuevo Proyecto <FaPlus/></button>
      </section>
      <section className="flex flex-col gap-y-[20px]">
        <h2 className="text-4xl text-fourth font-black">De pozo</h2>
        <div className="flex">
          <div className="bg-[url('/maturi.jpeg')] bg-blend-multiply w-[400px] h-[320px] bg-center flex justify-center duration-500 justify-content-center hover:bg-first/40">
            <h3 className="w-full h-[80px] text-fourth text-3xl font-bold flex items-center justify-center bg-first/50">Ricario</h3>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-y-[20px]">
        <h2 className="text-4xl text-fourth font-black">En desarrollo</h2>
        <div className="flex">
          <div className="bg-[url('/baumo.jpeg')] bg-cover bg-blend-multiply w-[400px] h-[320px] bg-center flex justify-center duration-500 justify-content-center hover:bg-first/40">
            <h3 className="w-full h-[80px] text-fourth text-3xl font-bold flex items-center justify-center bg-first/50">Baumo</h3>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-y-[20px]">
        <h2 className="text-4xl text-fourth font-black">Finalizados</h2>
        <Link to={"/rawson"}>
          <div className="flex">
            <div className="bg-[url('/render.jpeg')] bg-blend-multiply w-[400px] h-[320px] bg-right bg-cover flex justify-center duration-500 justify-content-center hover:bg-first/40">
              <h3 className="w-full h-[80px] text-fourth text-3xl font-bold flex items-center justify-center bg-first/50">Rawson 1</h3>
            </div>
          </div>
        </Link>
      </section>
    </Main>
  )
}

export default Projects