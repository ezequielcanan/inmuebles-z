import ProjectCard from "./ProjectCard"

const ProjectsSection = ({ section, projects }) => {
  return (
    <section className="flex flex-col gap-y-[20px]">
      <h2 className="text-4xl text-fourth font-black">{section}</h2>
      <div className="flex gap-x-[40px]">
        {projects.length ? (projects.map((p,i) => {
          return <ProjectCard title={p.title} thumbnail={p.thumbnail} path={p._id} key={i}/>
        })) : (
          <h3 className="text-third text-3xl">No se encontraron datos</h3>
        )}
      </div>
    </section>
  )
}

export default ProjectsSection