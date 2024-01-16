import { useEffect, useState } from "react"
import Main from "../containers/Main"

const Admin = () => {
  const [users, setUsers] = useState()
  const roles = ["admin", "secretary", "user", "unknow"]
  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_API_URL}/api/users`, { credentials: true }).then(res => res.json()).then(json => setUsers(json.payload))
  }, [])
  return (
    <Main className={"bg-gradient-to-tr from-indigo-500 from-30% via-sky-500 via-60% to-emerald-500 to-90%"}>
      {roles.map((r, i) => {
        return <div key={i} className="flex flex-col gap-y-[50px]">
           
        </div>
      })}
    </Main>
  )
}

export default Admin