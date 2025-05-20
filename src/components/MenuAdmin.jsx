import React from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/menuAdmin.module.css';

export default function MenuAdmin() {
    return (
        <>
            <NavBarWithButtons />
            <div className={styles.horizontalLine}></div> {/* Línea horizontal por encima */}
            <div className={styles.container}>
                <div className={styles.leftSection}></div>
                <div className={styles.rightSection}>
                    <h2 className={styles.topRightSubtitle}>Menú Administrativos</h2>
                    <h1 className={styles.title}>¡Bienvenido!</h1>
                </div>
            </div>
        </>
    );
}