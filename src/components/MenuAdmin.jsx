// src/components/MenuAdmin.jsx
import React from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/menuAdmin.module.css';

export default function MenuAdmin() {
    return (
        <>
            <NavBarWithButtons />
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    {/* Aquí podría ir otro contenido */}
                </div>
                <div className={styles.rightSection}>
                    <h1 className={styles.title}>¡Bienvenido!</h1>
                    <h2 className={styles.topRightSubtitle}>Menú Administrativo</h2>
                    <div className={styles.hexagonGrid}>
                        <div className={`${styles.hexagon} ${styles["editar-eliminar"]}`}>
                            EDITAR / ELIMINAR
                            <div className={styles["editar-eliminar-opciones"]}>
                                <button onClick={() => window.location.href = 'editar-eliminarestudiante.html'}>Estudiante</button>
                                <button onClick={() => window.location.href = 'editar-eliminarUsuario.html'}>Usuario</button>
                            </div>
                        </div>
                        <div className={styles.hexagon} onClick={() => window.location.href = 'visualizarAst.html'}>
                            VISUALIZAR ASISTENCIA
                        </div>
                        <div className={styles.hexagon} onClick={() => window.location.href = 'analisisDatos.html'}>
                            ANÁLISIS DE DATOS
                        </div>
                        <div className={styles.hexagon} onClick={() => window.location.href = 'tomarAsistencia.html'}>
                            TOMAR ASISTENCIA
                        </div>
                        <div className={styles.hexagon} onClick={() => window.location.href = 'visualizarEst.html'}>
                            VISUALIZAR ESTUDIANTE
                        </div>
                        <div className={`${styles.hexagon} ${styles.agregar}`}>
                            AGREGAR
                            <div className={styles["agregar-opciones"]}>
                                <button onClick={() => window.location.href = 'agregarEstudiante.html'}>Estudiante</button>
                                <button onClick={() => window.location.href = 'agregarUsuario.html'}>Usuario</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}