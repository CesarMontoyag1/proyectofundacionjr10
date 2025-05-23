import React, { useEffect } from 'react';
import NavBar from './NavBar';
import styles from '../styles/Home.module.css';
import niñoImg from '../assets/NiñoInicio.png';
import logoImg from '../assets/logoFundacionBlanco.png';

export default function Home() {
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
            {/* Aquí insertas tu NavBar */}
            <NavBar />

            {/* Tu contenido principal permanece igual */}
            <section className={styles.mainContent}>
                <div className={styles.leftContent}>
                    <h1>BaseKids</h1>
                    <p>Monitoreo de la asistencia a las actividades de nuestros niños.</p>
                </div>
                <div className={styles.rightContent}>
                    <img src={niñoImg} alt="Niño BaseKids" />
                </div>
            </section>

            <img src={logoImg} alt="Logo Fundación" className={styles.logo} />
        </div>
    );
}
