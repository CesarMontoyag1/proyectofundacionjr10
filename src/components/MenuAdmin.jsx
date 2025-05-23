import React from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/menuAdmin.module.css';
import Slider from 'react-slick';
import MenuFutbolNinos from '../assets/MenuFutbolNinos.jpg';
import MenuJamesNinas from '../assets/MenuJamesNinas.jpg';
import NinosJames from '../assets/MenuNinosj.jpg';
import jameHospitals from '../assets/JamesHospital.jpg';
import fondoDepantalla6 from '../assets/fondoblanco.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Flecha personalizada para "Anterior"
function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles.customArrow} ${styles.prevArrow}`}
            style={{ ...style, left: '20px', zIndex: 5 }} // Posición ajustada
            onClick={onClick}
        >
            &#10094; {/* Un símbolo de flecha izquierda más moderno */}
        </div>
    );
}

// Flecha personalizada para "Siguiente"
function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} ${styles.customArrow} ${styles.nextArrow}`}
            style={{ ...style, right: '20px', zIndex: 5 }} // Posición ajustada
            onClick={onClick}
        >
            &#10095; {/* Un símbolo de flecha derecha más moderno */}
        </div>
    );
}

export default function MenuAdmin() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000, // Un poco más rápido para dinamismo
        accessibility: true, // Mejorar accesibilidad
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        fade: true, // Efecto de desvanecimiento
        cssEase: 'ease-in-out', // Suaviza la transición
        pauseOnHover: true, // Pausa el autoplay al pasar el mouse
    };

    return (
        <>
            <NavBarWithButtons />
            <div
                className={styles.container}
                style={{
                    backgroundImage: `url(${fondoDepantalla6})`,
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
                    <h2 className={styles.topRightSubtitle}>Menú Administrativo</h2>
                    <div className={styles.hexagonGrid}>
                        <div className={`${styles.hexagon} ${styles["editar-eliminar"]}`}>
                            EDITAR / ELIMINAR
                            <div className={styles["editar-eliminar-opciones"]}>
                                <button onClick={() => window.location.href = 'editar-eliminarEst'}>Estudiante</button>
                                <button onClick={() => window.location.href = 'editar-eliminarUsu'}>Usuario</button>
                            </div>
                        </div>
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
                        <div className={`${styles.hexagon} ${styles.agregar}`}>
                            AGREGAR
                            <div className={styles["agregar-opciones"]}>
                                <button onClick={() => window.location.href = 'agregar-est'}>Estudiante</button>
                                <button onClick={() => window.location.href = 'agregar-usu'}>Usuario</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}