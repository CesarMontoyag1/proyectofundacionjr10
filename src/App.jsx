import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Presentacion from './components/Presentacion';
import Informacion from './components/Informacion';
import Login from './components/Login';
import Nosotros from './components/Nosotros';

export default function App() {
    return (
        <>
            <NavBar />
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
            </Routes>
        </>
    );
}
