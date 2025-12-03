import { Routes, Route } from "react-router-dom"
import Login from '../pages/Login/login'
import Register from '../pages/Register/register'
import Home from '../pages/Home/home'
import Main from '../pages/Main/main'
import Mapa from '../pages/Mapa/mapa';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/main" element={<Main/>}></Route>
            <Route path="/mapa" element={<Mapa />} />
            <Route path="*" element={<Login/>}></Route>
        </Routes>
    )
}