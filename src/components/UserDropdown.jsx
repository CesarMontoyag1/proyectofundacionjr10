// components/UserDropdown.jsx
import React from 'react';
import styles from '../styles/UserDropdown.module.css';

export default function UserDropdown({ visible, nombre }) {
    if (!visible) return null;

    const handleLogout = () => {
        // Redirige al usuario a la página de inicio de sesión o principal
        localStorage.removeItem('user'); // Asegúrate de limpiar cualquier dato de usuario
        window.location.href = 'http://localhost:5175/'; // La URL de tu página de inicio
    };

    return (
        <div className={styles.dropdown}>
            {/* Información del usuario */}
            <p className={styles.userInfo}>Hola, {nombre}</p>
            {/* Separador visual */}
            <div className={styles.separator}></div>
            {/* Botón de acción */}
            <button onClick={handleLogout} className={styles.actionButton}>
                Cerrar sesión
            </button>
        </div>
    );
}