import React from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/menuAdmin.module.css';

export default function MenuAdmin() {
    return (
        <>
            <NavBarWithButtons />
            <div className={styles.container}>
                <div className={styles.leftSection}></div>
                <div className={styles.rightSection}></div>
            </div>
        </>
    );
}