import { useEffect, useState } from "react"
import Main from "../containers/Main"
import UserSection from "../components/UserSection"
import { BounceLoader } from "react-spinners"

const Admin = () => {
  const [users, setUsers] = useState()
  const roles = [{field: "admin", text: "Administradores"}, {field: "secretary", text: "Secretarios"}, {field: "user", text: "Usuarios"}, {field: "unknow", text: "Desconocidos"}]
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/user`, { credentials: "include" }).then(res => res.json()).then(json => setUsers(json.payload))
  }, [])
  return (
    <Main className={"pt-[200px] gap-y-[100px] bg-gradient-to-tr from-indigo-500 from-30% via-sky-500 via-60% to-emerald-500 to-90%"}>
      {users ? (
        roles.map((r, i) => {
          return users[r.field][0] && <UserSection key={i} users={users[r.field]} role={r.text}/>
        })
      ) : (
        <BounceLoader/>
      )}
    </Main>
  )
}

export default Admin