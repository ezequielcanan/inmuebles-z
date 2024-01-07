import FormInput from "./FormInput"

const Form = ({ fields, register, onSubmit }) => {
  return (
    <form className="px-8 py-8 rounded-md text-5xl text-fourth bg-third flex flex-col gap-y-[50px] items-center" onSubmit={onSubmit}>
      {fields.map((f, i) => {
        return <FormInput field={f} register={register} i={i} key={i}/>
      })}
      <button type="submit" className="bg-second px-4 py-3 shadow-xl">Enter</button>
    </form>
  )
}

export default Form