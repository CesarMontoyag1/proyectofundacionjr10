import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import JamesInfo from '../assets/JamesInicio.png';
import styles from '../styles/Login.module.css';

export default function Login() {
    const [showPwd, setShowPwd] = useState(false);
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    const handleLogin = () => {
        // Aquí puedes agregar lógica de validación si es necesario
        navigate('/menu-admin'); // Redirige al menú de administrador
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Formulario */}
                <div className={styles.formWrapper}>
                    <h2 className={styles.title}>
                        Ingresa tus datos para iniciar sesión
                    </h2>

                    <label className={styles.label}>Usuario</label>
                    <input
                        type="text"
                        placeholder="Introduce tu usuario…"
                        className={styles.input}
                    />

                    <label className={styles.label}>Contraseña</label>
                    <div className={styles.pwdWrapper}>
                        <input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="Introduce tu contraseña…"
                            className={styles.input}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className={styles.toggleBtn}
                            aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={styles.eyeIcon}
                            >
                                {showPwd ? (
                                    <>
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>

                    <button
                        className={styles.submitBtn}
                        onClick={handleLogin} // Llama a la función handleLogin
                    >
                        Iniciar Sesión
                    </button>
                </div>

                {/* Imagen */}
                <div className={styles.imageWrapper}>
                    <img
                        src={JamesInfo}
                        alt="James Rodríguez con niños"
                        className={styles.image}
                    />
                </div>
            </div>
        </div>
    );
}