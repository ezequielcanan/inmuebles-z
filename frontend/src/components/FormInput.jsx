import { FaImage } from "react-icons/fa"
import {RxCross1} from "react-icons/rx"

const FormInput = ({ field, register = (a) => { }, i }) => {
  const inputClassName = "text-first py-2 px-3 rounded !outline-none shadow-xl shadow-[#222] duration-300 focus:bg-[#ffffffaa]"
  const labelClassName = "drop-shadow-[10px_10px_10px_rgba(0,0,0,1)]"
  const types = {
    checkbox: ({ multiOptions, name, type, checkedState, label, onChangeFunction, options, className, stateFunc = (a) => { }, value }) => {
      return !multiOptions ? options.map((option, index) => {
        return <div className="flex items-center justify-between w-full gap-x-[40px]" key={index}>
          <label className={labelClassName} htmlFor={name}>{option}</label>
          <input type={type} {...register(name)} onChange={() => onChangeFunction(option)} checked={option == checkedState} className={"w-16 h-16 " + className} />
        </div>
      }) : (
        <div className="flex items-center justify-between w-full gap-x-[40px]" key={i}>
          <label className={labelClassName} htmlFor={name}>{label}</label>
          <input type={type} {...register(name)} className={"w-16 h-16 " + className} onChange={(e) => stateFunc(e.target.checked)} defaultChecked={value} />
        </div>
      )
    },
    select: (({ name, label, className, options, value, disabled, onChange, onClick }, i) => {
      return <div className="flex items-center justify-between w-full gap-x-[40px]" key={i}>
        {label && <label className={labelClassName} htmlFor={name}>{label}</label>}
        <select onChange={onChange} onClick={onClick} className={"text-fourth text-center appearance-none bg-sixth px-3 py-2 duration-300 rounded hover:bg-second " + className} {...register(name)} defaultValue={value} disabled={disabled || false}>
          {options.map((option, index) => {
            return <option className="flex items-center justify-between w-full gap-x-[40px]" key={index} value={option}>
              {option}
            </option>
          })}
        </select>
      </div>
    }),
    file: (({ type, name, imageState, onChangeFunction, label = "", className, justify, value }, i) => {
      return <div key={i} className={"flex items-center justify-between w-full gap-x-[40px] " + justify}>
        {label ? <label className={labelClassName} htmlFor="">{label}</label> : null}
        <input type={type} className="hidden" id={name} {...register(name) || null} onChange={e => onChangeFunction(e)} />
        <label htmlFor={name} className={(!imageState && ("py-16 px-16 border-dashed ")) + "cursor-pointer text-center flex items-center justify-center border-4 border-sixth " + className}>{ (!imageState) ? <FaImage /> : <img className="w-[200px] h-[200px]" src={!imageState ? "" : (!imageState.size ? imageState : URL.createObjectURL(imageState))} />}</label>
      </div>
    }),
    text: (({ type, name, label, className, stateFunc, value, disabled, onChange = () => { }, suggestions, setOwner, suggestedOwner }, i) => {
      return <div className="flex items-center justify-between w-full gap-x-[40px] relative" key={i}>
        <label className={labelClassName} htmlFor={name}>{label}</label>
        {!suggestedOwner ?
          (
            <>
              <input onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault()}} type={type} {...register(name)} className={`${inputClassName} ${className}`} onChange={stateFunc ? ((e) => (stateFunc(e.target.value))) : (e) => onChange(e.target.value)} defaultValue={value || ""} disabled={disabled || false} />
              {suggestions?.length ? (
                <div className="absolute bottom-0 right-0 bg-second text-first rounded text-3xl flex flex-col overflow-y-scroll h-full">
                  {suggestions.map((s, i) => {
                    return <span key={i} className="w-full flex items-center justify-center h-full py-2 px-2 text-fourth duration-300 hover:bg-third" onClick={() => setOwner(s)}>{s.name}</span>
                  })}
                </div>
              ) : null}
            </>
          ) : (
           <div className="bg-second">
              <h3 className="text-6xl text-fourth py-3 px-3 flex gap-x-[20px] items-center">{suggestedOwner.name} <RxCross1 onClick={() => setOwner(false)}/></h3>
           </div>
          )}
      </div>
    }),
    password: (({ type, name, label, className, stateFunc, value, disabled, onChange = () => { }, suggestions, setOwner, suggestedOwner }, i) => {
      return <div className="flex items-center justify-between w-full gap-x-[40px] relative" key={i}>
        <label className={labelClassName} htmlFor={name}>{label}</label>
        {!suggestedOwner ?
          (
            <>
              <input onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault()}} type={type} {...register(name)} className={`${inputClassName} ${className}`} onChange={stateFunc ? ((e) => (stateFunc(e.target.value))) : (e) => onChange(e.target.value)} defaultValue={value || ""} disabled={disabled || false} />
              {suggestions?.length ? (
                <div className="absolute top-0 right-0 bg-second text-first rounded text-3xl flex flex-col overflow-y-scroll h-[52px]">
                  {suggestions.map((s, i) => {
                    return <span key={i} className="w-full flex items-center justify-center h-[52px] py-2 px-2 text-fourth duration-300 hover:bg-third" onClick={() => setOwner(s)}>{s.name}</span>
                  })}
                </div>
              ) : null}
            </>
          ) : (
           <div className="bg-second">
              <h3 className="text-6xl text-fourth py-3 px-3 flex gap-x-[20px] items-center">{suggestedOwner.name} <RxCross1 onClick={() => setOwner(false)}/></h3>
           </div>
          )}
      </div>
    }),
    number: (({ type, name, label, checkedState, className, disabled, value }, i) => {
      return <div className="flex items-center justify-between w-full gap-x-[40px]" key={i}>
        <label className={labelClassName} htmlFor={name}>{label}</label>
        <input onKeyDown={(e) => { e.key === 'Enter' && e.preventDefault()}} type={type} step={0.01} {...register(name)} disabled={checkedState ? "disabled" : disabled} onWheel={e => e.target.blur()} className={`${inputClassName} w-1/6 appareance-none ${checkedState && "text-transparent"} ${className}`} defaultValue={value} />
      </div>
    }),
    date: (({ type, name, label, className, value }, i) => {
      return <div className="flex items-center justify-between w-full gap-x-[40px]" key={i}>
        <label className={labelClassName} htmlFor={name}>{label}</label>
        <input type={type} {...register(name)} className={`${inputClassName} ${className}`} defaultValue={value} />
      </div>
    })
  }

  return types[field.type](field, i)
}

export default FormInput