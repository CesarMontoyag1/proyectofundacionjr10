import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/AgregarUsu.module.css';
import fondoDepantalla2 from '../assets/fondoblanco.png';

export default function AgregarUsu() {
    const [formData, setFormData] = useState({
        tipoDocumento: '',
        numeroDocumento: '',
        Nombre: '',
        Apellido: '',
        Usuario: '',
        Password: '',
        Rol: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);

        try {
            const response = await fetch('http://localhost:3000/agregarUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tipoDocumento: formData.tipoDocumento,
                    numeroDocumento: formData.numeroDocumento,
                    nombre: formData.Nombre,
                    apellidos: formData.Apellido,
                    username: formData.Usuario,
                    password: formData.Password,
                    rol: formData.Rol,
                    email: formData.email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Usuario agregado exitosamente');
                setFormData({
                    tipoDocumento: '',
                    numeroDocumento: '',
                    Nombre: '',
                    Apellido: '',
                    Usuario: '',
                    Password: '',
                    Rol: '',
                    email: '',
                });
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al agregar usuario:', error);
            alert('Error al agregar usuario');
        }
    };

    return (
        <>
            <NavBarWithButtons />
            <div
                className={styles.container}
                style={{
                    backgroundImage: `url(${fondoDepantalla2})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                }}
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>Agregar Usuario</h1>

                    {/* ESTE ES EL NUEVO DIV ENVOLVENTE */}
                    <div className={styles.fieldsContainer}>
                        <div className={styles.column}>
                            <div className={styles.formGroup}>
                                <label htmlFor="tipoDocumento">Tipo de Documento:</label>
                                <select
                                    id="tipoDocumento"
                                    name="tipoDocumento"
                                    value={formData.tipoDocumento}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione</option>
                                    <option value="CC">C.C.</option>
                                    <option value="TI">T.I.</option>
                                    <option value="RC">R.C.</option>
                                    <option value="CE">C.E.</option>
                                    <option value="NUIP">NUIP</option>
                                    <option value="PASAPORTE">PASAPORTE</option>
                                    <option value="NIT">NIT</option>
                                    <option value="CARNE_DIPLOMATICO">CARNE DIPLOMÁTICO</option>
                                    <option value="PEP">PERMISO ESPECIAL DE PERMANENCIA (P.E.P)</option>
                                    <option value="CERTIFICADO_CABILDO">CERTIFICADO CABILDO</option>
                                    <option value="NES">NES</option>
                                    <option value="TMF">TARJETA DE MOVILIDAD FRONTERIZA (TMF)</option>
                                    <option value="VISA">VISA</option>
                                    <option value="ID_EXTRANJEROS">ID EXTRANJEROS DIFERENTE A LA CÉDULA DE EXTRANJERÍA</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="numeroDocumento">Número de Documento:</label>
                                <input
                                    type="text"
                                    id="numeroDocumento"
                                    name="numeroDocumento"
                                    value={formData.numeroDocumento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="primerNombre"> Nombre:</label>
                                <input
                                    type="text"
                                    id="primerNombre"
                                    name="Nombre"
                                    value={formData.Nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="segundoNombre">Apellido:</label>
                                <input
                                    type="text"
                                    id="segundoNombre"
                                    name="Apellido"
                                    value={formData.Apellido}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className={styles.column}>
                            <div className={styles.formGroup}>
                                <label htmlFor="primerApellido">Usuario:</label>
                                <input
                                    type="text"
                                    id="primerApellido"
                                    name="Usuario"
                                    value={formData.Usuario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="segundoApellido">Password:</label>
                                <input
                                    type="password"
                                    id="segundoApellido"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="estadoCivil">Rol:</label>
                                <select
                                    id="estadoCivil"
                                    name="Rol"
                                    value={formData.Rol}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione una opción</option>
                                    <option value="administrativo">Administrativo</option>
                                    <option value="profesor">Profesor</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="paisNacimiento">Email:</label>
                                <input
                                    type="email"
                                    id="paisNacimiento"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div> {/* CIERRE DEL NUEVO DIV fieldsContainer */}
                    <button type="submit" className={styles.submitButton}>
                        Agregar Usuario
                    </button>
                </form>
            </div>
        </>
    );
}