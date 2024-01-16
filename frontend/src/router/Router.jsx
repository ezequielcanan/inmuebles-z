import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import Projects from "../pages/Projects"
import Project from "../pages/Project"
import NewProject from "../pages/NewProject"
import FloorEdit from "../pages/FloorEdit"
import ApartmentEdit from "../pages/ApartmentEdit"
import Floor from "../pages/Floor"
import Apartment from "../pages/Apartment"
import NewTransaction from "../pages/NewTransaction"
import Transaction from "../pages/Transaction"
import Owner from "../pages/Owner"
import Login from "../pages/Login"
import Register from "../pages/Register"
import { UserContext } from "../context/userContext"
import { useContext } from "react"

const Router = () => {
  const { getUser } = useContext(UserContext)
  
  return (
    <BrowserRouter>
      <Navbar type={getUser() ? "default" : "login"} />
      <Routes>
        <Route path="/" element={<Home user={getUser()} />} />
        {!getUser() ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        ) : (
          <>
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/category/:category" />
            <Route path="/projects/:project" element={<Project />} />
            <Route path="/projects/:project/edit" />
            <Route path="/floors/:floor" element={<Floor />} />
            <Route path="/floors/:floor/edit" element={<FloorEdit />} />
            <Route path="/inmueble/:inmueble" element={<Apartment />} />
            <Route path="/inmueble/:inmueble/transaction" element={<NewTransaction />} />
            <Route path="/inmueble/:inmueble/edit" element={<ApartmentEdit />} />
            <Route path="/owners/:owner" element={<Owner />} />
            <Route path="/transaction/:tid" element={<Transaction />} />
            <Route path="/login" />
            <Route path="/register" />
          </>
        )}
      </Routes>
    </BrowserRouter >
  )
}

export default Router