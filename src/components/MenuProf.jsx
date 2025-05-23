// src/components/MenuProf.jsx
import React from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/menuProf.module.css';
import Slider from 'react-slick';
import MenuFutbolNinos from '../assets/MenuFutbolNinos.jpg';
import MenuJamesNinas from '../assets/MenuJamesNinas.jpg';
import NinosJames from '../assets/MenuNinosj.jpg';
import jameHospitals from '../assets/JamesHospital.jpg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import fondoDepantalla8 from '../assets/fondoblanco.png';

// Flecha personalizada para "Anterior"
function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles.customArrow} ${styles.prevArrow}`}
            style={{ ...style, left: '20px', zIndex: 5 }}
            onClick={onClick}
        >
            &#10094; {/* Símbolo de flecha izquierda moderno */}
        </div>
    );
}

// Flecha personalizada para "Siguiente"
function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles.customArrow} ${styles.nextArrow}`}
            style={{ ...style, right: '20px', zIndex: 5 }}
            onClick={onClick}
        >
            &#10095; {/* Símbolo de flecha derecha moderno */}
        </div>
    );
}

export default function MenuProf() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        accessibility: true,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        fade: true,
        cssEase: 'ease-in-out',
        pauseOnHover: true,
    };

    return (
        <>
            <NavBarWithButtons />
            <div
                className={styles.container}
                style={{
                    backgroundImage: `url(${fondoDepantalla8})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                }}
            >
                <div className={styles.carouselContainer}>
                    <Slider {...settings}>
                        <div>
                            <img src={MenuFutbolNinos} alt="Imagen 1" className={styles.carouselImage} />
                        </div>
                        <div>
                            <img src={MenuJamesNinas} alt="Imagen 2" className={styles.carouselImage} />
                        </div>
                        <div>
                            <img src={NinosJames} alt="Imagen 3" className={styles.carouselImage} />
                        </div>
                        <div>
                            <img src={jameHospitals} alt="Imagen 3" className={styles.carouselImage} />
                        </div>
                    </Slider>
                </div>
                <div className={styles.rightSection}>
                    <h1 className={styles.title}>¡Bienvenido!</h1>
                    <h2 className={styles.topRightSubtitle}>Menú del Profesor</h2>
                    <div className={styles.hexagonGrid}>
                        <div className={styles.hexagon} onClick={() => window.location.href = 'visualizar-Ast'}>
                            VISUALIZAR ASISTENCIA
                        </div>
                        <div className={`${styles.hexagon} ${styles["analisis-datos"]}`}>
                            ANÁLISIS DE DATOS
                            <div className={styles["analisis-datos-opciones"]}>
                                <button onClick={() => window.location.href = 'analisis-general'}>General</button>
                                <button onClick={() => window.location.href = 'analisis-institucion'}>Por Institución</button>
                            </div>
                        </div>
                        <div className={styles.hexagon} onClick={() => window.location.href = 'tomar-Ast'}>
                            TOMAR ASISTENCIA
                        </div>
                        <div className={styles.hexagon} onClick={() => window.location.href = 'visualizar-est'}>
                            VISUALIZAR ESTUDIANTE
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}