import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"
import Home from "../pages/Home"
import Apartment from "../pages/Apartment"
import Projects from "../pages/Projects"
import Project from "../pages/Project"
import Floor from "../pages/Floor"
import NewProject from "../pages/NewProject"

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/apartment" element={<Apartment/>}/>
        <Route path="/new-project" element={<NewProject/>}/>
        <Route path="/projects" element={<Projects/>}/>
        <Route path="/rawson" element={<Project/>}/>
        <Route path="/piso" element={<Floor/>}/>
        <Route path="/category/:category" />
        <Route path="/projects/:project" />
        <Route path="/projects/:project/edit" />
        <Route path="/projects/:project/:piso" />
        <Route path="/projects/:project/:piso/:inmueble"/>
        <Route path="/projects/:project/:piso/:inmueble/edit" />
        <Route path="/login" />
        <Route path="/register" />
      </Routes>
    </BrowserRouter>
  )
}

export default Router