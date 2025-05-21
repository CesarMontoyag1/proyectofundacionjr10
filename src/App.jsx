import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Presentacion from './components/Presentacion';
import Informacion from './components/Informacion';
import Login from './components/Login';
import Nosotros from './components/Nosotros';
import MenuAdmin from './components/MenuAdmin.jsx';
import MenuProf from './components/MenuProf.jsx';
import AgregarEst from './components/AgregarEst.jsx';
import TomarAsis from './components/TomarAsistencia.jsx';
import TomarAsistencia from "./components/TomarAsistencia.jsx";
import VisualizarAst from "./components/VisualizarAst.jsx";
import VisualizarEstudiante from "./components/VisualizarEst.jsx";
import VisualizarEst from "./components/VisualizarEst.jsx";
import AgregarUsu from "./components/AgregarUsu.jsx";

export default function App() {
    const location = useLocation();

    const noNavBarRoutes = ['/menu-admin', '/menu-profe','/agregar-est','/tomar-Ast', '/visualizar-Ast', '/visualizar-est','/agregar-usu' ];


    return (
        <>
            {/* Renderiza NavBar solo si la ruta actual no está en noNavBarRoutes */}
            {!noNavBarRoutes.includes(location.pathname) && <NavBar />}
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Presentacion />
                            <Informacion />
                        </>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/menu-admin" element={<MenuAdmin />} />
                <Route path="/menu-profe" element={<MenuProf />} />
                <Route path="/agregar-est" element={<AgregarEst />} />
                <Route path="/tomar-Ast" element={<TomarAsistencia />} />
                <Route path="/visualizar-Ast" element={<VisualizarAst />} />
                <Route path="/visualizar-est" element={<VisualizarEst />} />
                <Route path="/agregar-usu" element={<AgregarUsu />} />
            </Routes>
        </>
    );
}