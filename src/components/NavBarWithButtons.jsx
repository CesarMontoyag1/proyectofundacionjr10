import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import styles from '../styles/NavBarWithButtons.module.css';
import LogoBaseKids from '../assets/LogoBaseKids.png';
import NotificationDropdown from './NotificationDropdown';
import axios from 'axios';

export default function NavBarWithButtons() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:3000/notificaciones')
            .then(res => {
                const { notificaciones, nuevas } = res.data;
                setNotificationCount(nuevas ? 1 : 0); // Muestra la señal roja solo si hay nuevas
            })
            .catch(console.error);
    }, []);

    const toggleNotifications = () => {
        if (!showNotifications && notificationCount > 0) {
            axios.post('http://localhost:3000/notificaciones/leer')
                .then(() => setNotificationCount(0)) // Elimina la señal roja
                .catch(console.error);
        }
        setShowNotifications(!showNotifications);
    };

    const closeNotifications = () => {
        setShowNotifications(false);
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
                <button className={styles.menuTextButton}>Menú</button>

                <div style={{ position: 'relative' }}>
                    <button
                        className={styles.notificationButton}
                        onClick={toggleNotifications}
                        aria-label="Notificaciones"
                    >
                        <FaBell className={styles.notificationIcon} />
                        {notificationCount > 0 && (
                            <span className={styles.notificationBadge}>
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    <NotificationDropdown visible={showNotifications} onClose={closeNotifications} />
                </div>

                <button className={styles.userButton}>Usuario</button>
            </div>
        </nav>
    );
}