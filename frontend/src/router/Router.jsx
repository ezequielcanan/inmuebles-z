import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "../components/Navbar"

const Router = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" />
        <Route path="/new-project" />
        <Route path="/category/:category" />
        <Route path="/:proyect" />
        <Route path="/:proyect/edit" />
        <Route path="/:proyect/:piso" />
        <Route path="/:proyect/:piso/:inmueble" />
        <Route path="/:proyect/:piso/:inmueble/edit" />
        <Route path="/login" />
        <Route path="/register" />
      </Routes>
    </BrowserRouter>
  )
}

export default Router