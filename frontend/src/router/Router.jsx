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
import Transaction from "../pages/Transaction"

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/new-project" element={<NewProject/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/category/:category" />
        <Route path="/projects/:project" element={<Project/>}/>
        <Route path="/projects/:project/edit" />
        <Route path="/floors/:floor" element={<Floor/>}/>
        <Route path="/floors/:floor/edit" element={<FloorEdit/>}/>
        <Route path="/inmueble/:inmueble" element={<Apartment/>}/>
        <Route path="/inmueble/:inmueble/transaction" element={<Transaction/>}/>
        <Route path="/inmueble/:inmueble/edit" element={<ApartmentEdit/>}/>
        <Route path="/login" />
        <Route path="/register" />
      </Routes>
    </BrowserRouter>
  )
}

export default Router