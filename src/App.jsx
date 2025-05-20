import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Presentacion from './components/Presentacion';
import Informacion from './components/Informacion';
import Login from './components/Login';
import Nosotros from './components/Nosotros';
import MenuAdmin from './components/MenuAdmin.jsx';
import MenuProf from './components/MenuProf.jsx';

export default function App() {
    const location = useLocation();

    const noNavBarRoutes = ['/menu-admin', '/menu-profe'];


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
            </Routes>
        </>
    );
}