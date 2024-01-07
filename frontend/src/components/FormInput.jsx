import { FaImage } from "react-icons/fa"

const FormInput = ({field, register, i}) => {
  const types = {
    checkbox: ({ multiOptions, name, type, checkedState, onChangeFunction, options }) => {
      return !multiOptions && options.map((option, index) => {
        return <div className="flex items-center justify-between w-full gap-x-[40px]" key={index}>
          <label htmlFor={name}>{option}</label>
          <input type={type} {...register(name)} onChange={() => onChangeFunction(option)} checked={option == checkedState} className="w-16 h-16" />
        </div>
      })
    },
    file: (({ type, name, imageState, onChangeFunction }, i) => {
      return <div key={i} className="flex items-center justify-between w-full gap-x-[40px]">
        <label htmlFor="">Imagen de portada:</label>
        <input type={type} className="hidden" id={name} {...register(name)} onChange={e => onChangeFunction(e)} />
        <label htmlFor={name} className={(!imageState && ("py-16 px-16 border-dashed ")) + "cursor-pointer text-center flex items-center justify-center border-4 border-sixth"}>{!imageState ? <FaImage /> : <img className="w-[200px] h-[200px]" src={URL.createObjectURL(imageState)} />}</label>
      </div>
    }),
    text: (({ type, name, label }, i) => {
      return <div className="flex items-center justify-between w-full gap-x-[40px]" key={i}>
        <label htmlFor={name}>{label}</label>
        <input type={type} {...register(name)} className="text-first py-4 px-6 rounded !outline-none shadow-xl duration-300 focus:bg-[#ffffffaa]" />
      </div>
    })
  }

  return types[field.type](field, i)
}

export default FormInput