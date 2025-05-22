// components/NavBarWithButtons.jsx
import React from 'react';
import { FaBell } from 'react-icons/fa';
import styles from '../styles/NavBarWithButtons.module.css';
import LogoBaseKids from '../assets/LogoBaseKids.png';

export default function NavBarWithButtons() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <h1 className={styles.title}>
                    BASEKIDS
                    <img
                        className={styles.logo}
                        src={LogoBaseKids}
                        alt="logo"
                    />
                </h1>
            </div>
            <div className={styles.buttonsContainer}>
                {/* Aquí está el botón de Menú modificado */}
                <button className={styles.menuTextButton}>
                    Menú
                </button>
                <button className={styles.notificationButton} aria-label="Notificaciones">
                    <FaBell className={styles.notificationIcon} />
                </button>
                <button className={styles.userButton}>
                    Usuario
                </button>
            </div>
        </nav>
    );
}