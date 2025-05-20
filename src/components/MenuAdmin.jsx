// src/components/MenuAdmin.jsx
import React from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/menuAdmin.module.css';
import Slider from 'react-slick';
import MenuFutbolNinos from '../assets/MenuFutbolNinos.jpg';
import MenuJamesNinas from '../assets/MenuJamesNinas.jpg';
import NinosJames from '../assets/MenuNinosj.jpg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



export default function MenuAdmin() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        accessibility: false,
        arrows: true, // Habilita las flechas predeterminadas
    };

    return (
        <>
            <NavBarWithButtons />
            <div className={styles.container}>
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
                    </Slider>
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