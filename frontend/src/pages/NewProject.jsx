import Main from "../containers/Main"
import Form from "../components/Form"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

const NewProject = () => {
  const [image, setImage] = useState(false)
  const [selected, setSelected] = useState("De pozo")
  const [project, setProject] = useState(null)
  const { project: pid } = useParams()
  const { handleSubmit, register } = useForm()
  const navigate = useNavigate()

  const onChange = (i) => {
    setSelected(i)
  }

  const loadImage = (file) => {
    setImage(file)
  }

  pid && useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/projects/${pid}`, { credentials: "include" })
      .then(res => res.json())
      .then(json => (setProject(json?.payload || null), loadImage(`${import.meta.env.VITE_REACT_API_URL}/static/${json?.payload?.thumbnail}`), setSelected(json?.payload?.type)))
  }, [])

  const onSubmit = handleSubmit(async data => {
    data.type = selected
    data.title == "" && (data.title = project?.title)
    data.address == "" && (data.address = project?.address)
    image.size ? (data.ext = image.name.substring(image.name.lastIndexOf('.'), image.name.length)) : (data.ext = image.substring(image.lastIndexOf('.'), image.length))
    project && (data._id = project._id)
    const formData = new FormData()

    const result = await (await fetch(import.meta.env.VITE_REACT_API_URL + "/api/projects", { method: "POST", body: JSON.stringify({ ...project, ...data }), headers: { "Content-Type": "application/json" }, credentials: "include" })).json()
    data.folder = `projects/${result.payload._id}`
    data.thumbnail = result.payload.thumbnail
    data.id = result.payload._id

    formData.append("data", JSON.stringify(data))
    formData.append("file", image)

    const imageResult = (image?.size && (await (await fetch(import.meta.env.VITE_REACT_API_URL + "/api/projects/file", { method: "POST", body: formData, credentials: "include" })).json()))
    console.log(imageResult)
    window.location.replace("/projects")
  })

  const fields = [
    {
      type: "text",
      name: "title",
      label: "Nombre: ",
      value: project?.title || ""
    },
    {
      type: "text",
      name: "address",
      label: "Direccion: ",
      value: project?.address || ""
    },
    {
      type: "checkbox",
      name: "type",
      multiOptions: false,
      options: [
        "De pozo",
        "En desarrollo",
        "Finalizado"
      ],
      onChangeFunction: onChange,
      checkedState: selected,
      value: project?.type || ""
    },
    {
      type: "file",
      name: "file",
      imageState: image,
      onChangeFunction: (e) => loadImage(e.target.files[0]),
      label: "Imagen de portada:"
    }
  ]

  return (
    <Main className={"bg-sixth pt-[200px] items-center gap-y-[100px]"}>
      <h1 className="text-6xl font-black text-fourth">{project ? "Editar presentacion" : "Ingresar Nuevo Proyecto"}</h1>
      <Form fields={fields} register={register} onSubmit={onSubmit} />
    </Main>
  )
}

export default NewProject