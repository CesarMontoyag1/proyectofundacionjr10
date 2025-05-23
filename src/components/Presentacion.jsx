import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Presentacion.module.css';

export default function Presentacion() {
    return (
        <section className={styles.hero}>
            <div className={styles.inner}>
                <p className={styles.subtitle}>
                    SISTEMA DE MONITOREO DE ASISTENCIA
                </p>
                <h1 className={styles.title}>
                    Fundación Colombia Somos Todos
                </h1>
                <h2 className={styles.name}>
                    JAMES RODRÍGUEZ
                </h2>
                <Link to="/login" className={styles.btn}>
                    Iniciar Sesión
                </Link>
            </div>
        </section>
    );
}
