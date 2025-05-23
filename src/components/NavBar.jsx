import React from 'react';
import LogoBaseKids from '../assets/LogoBaseKids.png';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; // Asegúrate de que la ruta sea correcta

const NavBar = () => {
    return (
        <div className="navbar">
            <h1 className="title">
                BASEKIDS
                <img
                    className="logo"
                    src={LogoBaseKids}
                    alt="logo"
                />
            </h1>
            <ul className="menu">
                <Link to="/" className="menu-item">Inicio</Link>
                <Link to="/nosotros" className="menu-item">Nosotros</Link>
            </ul>
        </div>
    );
};

export default NavBar;