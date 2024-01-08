import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import Apartment from "../pages/Apartment"
import Projects from "../pages/Projects"
import Project from "../pages/Project"
import NewProject from "../pages/NewProject"
import Floor from "../pages/Floor"
import ApartmentEdit from "../pages/ApartmentEdit"

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/apartment" element={<Apartment/>}/>
        <Route path="/new-project" element={<NewProject/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/piso" element={<Floor/>}/>
        <Route path="/category/:category" />
        <Route path="/projects/:project" element={<Project/>}/>
        <Route path="/projects/:project/edit" />
        <Route path="/floors/:floor/edit" element={<Floor/>}/>
        <Route path="/inmueble/:inmueble"/>
        <Route path="/inmueble/:inmueble/edit" element={<ApartmentEdit/>}/>
        <Route path="/login" />
        <Route path="/register" />
      </Routes>
    </BrowserRouter>
  )
}

export default Router