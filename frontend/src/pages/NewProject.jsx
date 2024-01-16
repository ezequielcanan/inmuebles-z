import Main from "../containers/Main"
import Form from "../components/Form"
import { useState } from "react"
import {useForm} from "react-hook-form"
import { useNavigate } from "react-router-dom"

const NewProject = () => {
  const [image, setImage] = useState(false)
  const [selected, setSelected] = useState("De pozo")
  const {handleSubmit, register} = useForm()
  const navigate = useNavigate()
  
  const onChange = (i) => {
    setSelected(i)
  }

  const loadImage = (e) => {
    setImage(e.target.files[0])
  }

  const onSubmit = handleSubmit(async data => {
    data.type = selected
    data.ext = image.name.substring(image.name.lastIndexOf('.'), image.name.length)
    const formData = new FormData()
    
    const result = await (await fetch(import.meta.env.VITE_REACT_API_URL + "/api/projects", {method: "POST", body: JSON.stringify({...data}), headers: {"Content-Type": "application/json"}, credentials: "include"})).json()
    data.folder = `projects/${result.payload._id}`
    data.thumbnail = result.payload.thumbnail
    data.id = result.payload._id
    formData.append("data",JSON.stringify(data))
    formData.append("file", image)

    const uploadImage = await (await fetch(import.meta.env.VITE_REACT_API_URL + "/api/projects/file", {method: "POST", body: formData, credentials: "include"})).json()
    navigate("/projects")
  })

  const fields = [
    {
      type: "text",
      name: "title",
      label: "Nombre: ",
    },
    {
      type: "text",
      name: "address",
      label: "Direccion: "
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
      checkedState: selected
    },
    {
      type: "file",
      name: "file",
      imageState: image,
      onChangeFunction: loadImage,
      label: "Imagen de portada:"
    }
  ]


  return (
    <Main className={"bg-sixth pt-[200px] items-center gap-y-[100px]"}>
      <h1 className="text-6xl font-black text-fourth">Ingresar Nuevo Proyecto</h1>
      <Form fields={fields} register={register} onSubmit={onSubmit}/>
    </Main>
  )
}

export default NewProject