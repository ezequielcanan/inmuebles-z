import FormInput from "./FormInput"

const Form = ({ fields, register, onSubmit, className, enter=true }) => {
  return (
    <form className={"px-16 py-16 rounded-md text-5xl text-fourth bg-gradient-to-t from-cyan-500 to-blue-500 flex flex-col gap-y-[50px] items-center "+className} onSubmit={onSubmit}>
      {fields.map((f, i) => {
        return <FormInput field={f} register={register} i={i} key={i}/>
      })}
      {enter && <button type="submit" className="bg-second px-4 py-3 shadow-xl">Enter</button>}
    </form>
  )
}

export default Form