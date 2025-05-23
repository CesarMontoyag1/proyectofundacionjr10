// components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JamesInfo from '../assets/BecasJames1.jpg';
import styles from '../styles/Login.module.css';

export default function Login() {
    const [showPwd, setShowPwd] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password }),
            });

            const data = await response.json();

            if (data.success) {
                // Guardamos en localStorage el usuario activo
                localStorage.setItem('user', JSON.stringify({
                    nombre: data.nombre,  // asegúrate que backend también envíe el nombre
                    rol: data.rol
                }));

                // Redirigimos según rol
                if (data.rol === 'administrativo') {
                    navigate('/menu-admin');
                } else if (data.rol === 'profesor') {
                    navigate('/menu-profe');
                } else {
                    alert('Rol no reconocido');
                }
            } else {
                alert(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.formWrapper}>
                    <h2 className={styles.title}>Ingresa tus datos para iniciar sesión</h2>
                    <label className={styles.label}>Usuario</label>
                    <input
                        type="text"
                        placeholder="Introduce tu usuario…"
                        className={styles.input}
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <label className={styles.label}>Contraseña</label>
                    <div className={styles.pwdWrapper}>
                        <input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="Introduce tu contraseña…"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className={styles.toggleBtn}
                            aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            {/* Icono del ojo */}
                        </button>
                    </div>
                    <button className={styles.submitBtn} onClick={handleLogin}>
                        Iniciar Sesión
                    </button>
                </div>
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