import NavBar from './NavBar';
import styles from '../styles/menuAdmin.module.css';
import React, { useEffect } from 'react';

export default function menuAdmin() {
    // Deshabilitar zoom con Ctrl+scroll y Ctrl+±
    useEffect(() => {
        const onWheel = e => { if (e.ctrlKey) e.preventDefault(); };
        const onKey = e => {
            if (e.ctrlKey && ['+','=','-'].includes(e.key)) e.preventDefault();
        };
        document.addEventListener('wheel', onWheel, { passive: false });
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('wheel', onWheel);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    return (
        <div className={styles.container}>
            <NavBar />

        </div>
    );
}