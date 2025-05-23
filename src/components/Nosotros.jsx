import React from 'react';
import styles from '../styles/Nosotros.module.css'; // Asegúrate de que la ruta sea correcta
import fondoNegro from '../assets/fondonegro.png'; // Ajusta la ruta según la ubicación de tu archivo


export default function Nosotros() {
    return (
        <div
            style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundImage: `url(${fondoNegro})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh', // Ocupa toda la altura de la pantalla
                color: 'white',
            }}
        >
            <h1 className={styles.title}>Nosotros</h1>
            <div className={styles.aboutSection}>
                <div className={`${styles.circle} ${styles.circle1}`}>
                    <span className={styles.defaultText}>IMPACTO</span>
                    <span className={styles.hoverText}>

                        <div>4535 Niños, niñas y adolescentes</div>
                        <div>1.970 Madres, padres y familiares.</div>
                        <div>88.608 Complementos nutricionales</div>
                        <div>81.540 Horas de tutorías</div>

                    </span>
                </div>
                <div className={`${styles.circle} ${styles.circle2}`}>
                    <span className={styles.defaultText}>¿QUÉ HACEMOS?</span>
                    <span className={styles.hoverText}>

                        <div>1. Mentorías para el alto rendimiento.</div>
                        <div>2. Intervenciones sociales y empresariales</div>
                        <div>3. Investigación social</div>
                        <div>4. Proyectos especiales para el valor social</div>

                    </span>
                </div>
                <div className={`${styles.circle} ${styles.circle3}`}>
                    <span className={styles.defaultText}>CAMPOS DE TRABAJO</span>
                    <span className={styles.hoverText}>

                        <div>1. Desarrollo Humano</div>
                        <div>2. Seguridad Vial</div>
                        <div>3. Alto Rendimiento en equipos y comunidades</div>
                        <div>4. Convivencia y reconciliación</div>

                    </span>
                </div>
            </div>



        </div>
    );
}