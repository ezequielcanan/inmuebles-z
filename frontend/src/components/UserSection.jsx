import { FaUserCircle, FaPencilAlt, FaEye, FaCross } from "react-icons/fa"

const UserSection = ({users, role}) => {
    return (
        <section className="flex flex-col gap-y-[30px]">
            <h2 className="text-4xl text-fourth font-semibold">{role}</h2>
            <div className="flex gap-x-[50px]">
                {users.map((u,i) => {
                    return <div className="flex flex-col gap-y-[20px] py-3 px-3 text-fourth bg-sixth w-[300px]">
                        <div className="flex gap-x-[20px] items-center"><FaUserCircle size={30}/><h3 className="text-3xl">{u.name}</h3></div>
                        <p>Email: {u.email}</p>
                        <p>Rol de usuario: {role}</p>
                        <select className="bg-third py-2 px-3">
                            <option value="Secretario">Secretario <FaPencilAlt size={15}/><FaEye size={15}/></option>
                            <option value="Usuario">Usuario <FaEye size={15}/></option>
                            <option value="Desconocido">Desconocido <FaCross/></option>
                        </select>
                    </div>
                })}
            </div>
        </section>
    )
}

export default UserSection