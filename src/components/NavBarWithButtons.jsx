import React from 'react';
import { FaBell, FaUser } from 'react-icons/fa';
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
                <button className={styles.iconButton} aria-label="Notificaciones">
                    <FaBell className={styles.icon} />
                </button>
                <button className={styles.iconButton} aria-label="Usuario">
                    <FaUser className={styles.icon} />
                </button>
            </div>
        </nav>
    );
}