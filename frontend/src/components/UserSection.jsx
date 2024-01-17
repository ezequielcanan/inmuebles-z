import { FaUserCircle, FaPencilAlt, FaEye, FaCross } from "react-icons/fa"

const UserSection = ({ users, role, reload, setReload }) => {
  const handleChange = async (e, user) => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/user/${user._id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: e.target.value }) })
      .then(res => res.json())
      .then(json => (console.log(json), json.status == "success" && setReload(!reload)))
  }

  return (
    <section className="flex flex-col gap-y-[30px]">
      <h2 className="text-4xl text-fourth font-semibold">{role}</h2>
      <div className="flex gap-x-[50px]">
        {users.map((u, i) => {
          return <div className="flex flex-col gap-y-[20px] py-3 px-3 text-fourth bg-sixth w-[300px] shadow-lg shadow-first" key={i}>
            <div className="flex gap-x-[20px] items-center"><FaUserCircle size={30} /><h3 className="text-3xl">{u.name}</h3></div>
            <p>Email: {u.email}</p>
            <p>Rol de usuario: {u.role == "admin" && role}</p>
            {u.role != "admin" && <select className="bg-third py-2 px-3" defaultValue={u.role} onChange={(e) => handleChange(e, u)}>
              <option value="secretary">Secretario</option>
              <option value="user">Usuario</option>
              <option value="unknow">Desconocido</option>
            </select>}
          </div>
        })}
      </div>
    </section>
  )
}

export default UserSection