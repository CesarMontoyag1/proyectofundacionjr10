import React from 'react';
import styles from '../styles/Nosotros2.module.css';
import niños5 from '../assets/niños5.jpg';
import niños6 from '../assets/niños6.jpg';
import niño8 from '../assets/niño8.jpg';
import instagramIcon from '../assets/iconoInstagram.png';
import facebookIcon from '../assets/iconoface21.png';
import officialPageIcon from '../assets/LogoBaseKids.png'; // Asegúrate de tener esta imagen en tu proyecto
import phoneIcon from '../assets/telefono.png'; // Ícono de teléfono
import emailIcon from '../assets/mail.png'; // Ícono de correo

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
                <p className={styles.paragraph}>
                    <span>Nuestra página:</span>
                    <br />
                    <a href="https://www.colombia-somostodos.org/" target="_blank" rel="noopener noreferrer" className={styles.officialPageLink}>
                        <img src={officialPageIcon} alt="Página oficial" className={styles.icon} />
                    </a>
                    <br />
                    <span className={styles.additionalText}>
                        <img src={phoneIcon} alt="Teléfono" className={styles.phoneIcon} />
                        +57 3007113917
                    </span>
                    <span className={styles.additionalText}>
                        <img src={emailIcon} alt="Correo" className={styles.emailIcon} />
                        col.somostodos@jamesrodriguez.com.co
                    </span>
                </p>
                <h3 className={styles.subtitle}>¡Síguenos en redes!</h3>
                <div className={styles.socialLinks}>
                    <a href="https://www.instagram.com/fundacion_colsomostodosjr/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                        <img src={instagramIcon} alt="Instagram" className={styles.icon} />
                    </a>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                        <img src={facebookIcon} alt="Facebook" className={`${styles.icon} ${styles.facebookIcon}`} />
                    </a>
                </div>
            </div>
        </div>
    );
}