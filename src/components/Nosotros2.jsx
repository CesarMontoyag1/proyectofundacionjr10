import React from 'react';
import styles from '../styles/Nosotros2.module.css';
import niños5 from '../assets/niños5.jpg';
import niños6 from '../assets/niños6.jpg';
import niño8 from '../assets/niño8.jpg';

export default function Nosotros2() {
    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <img src={niños5} alt="Niños 5" className={styles.gridItem} />
                <img src={niños6} alt="Niños 6" className={styles.gridItem} />
                <img src={niño8} alt="Niño 8" className={styles.gridItem} />
            </div>
            <div className={styles.textContainer}>
                <h2 className={styles.title}>Contáctanos</h2>
                <p1 className={styles.paragraph}>
                    Link de la página oficial: <a href="https://www.colombia-somostodos.org/" target="_blank" rel="noopener noreferrer">colombia-somostodos.org/</a>
                </p1>
                <p className={styles.paragraph}>
                     <a href="https://www.instagram.com/fundacioncolombiasomostodos/" target="_blank" rel="noopener noreferrer">Instagram</a>
                </p>
            </div>
        </div>
    );
}