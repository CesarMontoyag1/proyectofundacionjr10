import React from 'react';
import fondoNegro from '../assets/fondonegro.png'; // Ajusta la ruta según la ubicación de tu archivo

export default function Nosotros() {
    return (
        <div
            style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundImage: `url(${fondoNegro})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh', // Ajusta la altura según sea necesario
                color: 'white', // Cambia el color del texto para que sea legible
            }}
        >
            <h1>Nosotros</h1>
            <p>Información sobre la fundación.</p>
        </div>
    );
}