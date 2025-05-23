import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaRegBell } from 'react-icons/fa';
import styles from '../styles/NavBarWithButtons.module.css';
import LogoBaseKids from '../assets/LogoBaseKids.png';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';
import axios from 'axios';

export default function NavBarWithButtons() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [user, setUser] = useState({ nombre: '', rol: '' });

    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        // Carga de notificaciones y conteo de nuevas
        axios.get('http://localhost:3000/notificaciones')
            .then(res => {
                const { nuevas, notificaciones } = res.data;
                setNotificationCount(nuevas ? notificaciones.length : 0);
            })
            .catch(console.error);

        // Carga usuario activo de localStorage
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleNotifications = () => {
        if (!showNotifications && notificationCount > 0) {
            // Marcar como vistas
            axios.post('http://localhost:3000/notificaciones/leer')
                .then(() => setNotificationCount(0))
                .catch(console.error);
        }
        setShowNotifications(v => !v);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(v => !v);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <h1 className={styles.title}>
                    BASEKIDS
                    <img className={styles.logo} src={LogoBaseKids} alt="logo" />
                </h1>
            </div>
            <div className={styles.buttonsContainer}>
                {/* Botón Menú */}
                <button
                    className={styles.menuTextButton}
                    onClick={() => {
                        if (user.rol === 'profesor') window.location.href = '/menu-profe';
                        else if (user.rol === 'administrativo') window.location.href = '/menu-admin';
                    }}
                >
                    Menú
                </button>

                {/* Notificaciones */}
                <div
                    style={{ position: 'relative', display: 'inline-block' }}
                    ref={notificationRef}
                >
                    <button
                        className={styles.notificationButton}
                        onClick={toggleNotifications}
                        aria-label="Notificaciones"
                    >
                        {notificationCount > 0
                            ? <FaBell className={styles.notificationIcon} />
                            : <FaRegBell className={styles.notificationIcon} />}
                    </button>
                    {notificationCount > 0 && (
                        <span className={styles.notificationBadge}>{notificationCount}</span>
                    )}
                    <NotificationDropdown
                        visible={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>

                {/* Usuario */}
                <div
                    style={{ position: 'relative', display: 'inline-block' }}
                    ref={userMenuRef}
                >
                    <button
                        className={styles.userButton}
                        onClick={toggleUserMenu}
                        aria-label="Usuario"
                    >
                        Usuario
                    </button>
                    <UserDropdown
                        visible={showUserMenu}
                        nombre={user.nombre}
                        onClose={() => setShowUserMenu(false)}
                    />
                </div>
            </div>
        </nav>
    );
}