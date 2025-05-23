import React from 'react';
import { Link } from 'react-router-dom';
import JamesInfo from '../assets/niñosJames1.jpg';
import styles from '../styles/Informacion.module.css';

export default function Informacion() {
    return (
        <section className={styles.infoSection}>
            <div className={styles.grid}>
                <img
                    src={JamesInfo}
                    alt="James Rodríguez con niños"
                    className={styles.image}
                />
                <div className={styles.text}>
                    <p className={styles.subtitle}>¿Quiénes Somos?</p>
                    <h2 className={styles.heading}>
                        ¡Cada vez que cumplimos un sueño, gritamos gol!
                    </h2>
                    <p className={styles.paragraph}>
                        Un emprendimiento social liderado por James Rodríguez y su familia
                        desde el año 2011, orientado a propiciar cambios sociales mediante
                        el juego y el deporte. Impulsando la innovación social con
                        intervenciones en las que el fortalecimiento de mente y cuerpo,
                        contribuyan al desarrollo de una sociedad más amable y sostenible.
                    </p>
                    <Link to="/nosotros" className={styles.btnSecondary}>
                        NOSOTROS
                    </Link>
                </div>
            </div>
        </section>
    );
}
