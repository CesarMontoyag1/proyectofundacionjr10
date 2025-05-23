import React, { useEffect, useRef } from 'react';
import styles from '../styles/UserDropdown.module.css';

export default function UserDropdown({ visible, nombre, onClose }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose(); // Cierra el dropdown si se hace clic fuera
            }
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [visible, onClose]);

    if (!visible) return null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = 'http://localhost:5175/';
    };

    return (
        <div ref={dropdownRef} className={styles.dropdown}>
            <p className={styles.userInfo}>Hola, {nombre}</p>
            <div className={styles.separator}></div>
            <button onClick={handleLogout} className={styles.actionButton}>
                Cerrar sesión
            </button>
        </div>
    );
}