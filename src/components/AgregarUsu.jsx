import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/AgregarUsu.module.css';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
    };

    return (
        <>
            <NavBarWithButtons />
            <div className={styles.container}>
                <h1 className={styles.title}>Agregar Usuario</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="TI">Tarjeta de Identidad</option>
                                <option value="CE">Cédula de Extranjería</option>
                                <option value="Otro">Otro</option>
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
                                name="primerNombre"
                                value={formData.primerNombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="segundoNombre">Apellido:</label>
                            <input
                                type="text"
                                id="segundoNombre"
                                name="segundoNombre"
                                value={formData.segundoNombre}
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
                                name="primerApellido"
                                value={formData.primerApellido}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="segundoApellido">Password:</label>
                            <input
                                type="text"
                                id="segundoApellido"
                                name="segundoApellido"
                                value={formData.segundoApellido}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="estadoCivil">Rol:</label>
                            <select
                                id="estadoCivil"
                                name="estadoCivil"
                                value={formData.estadoCivil}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Profesor">Profesor</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="paisNacimiento">Email:</label>
                            <input
                                type="text"
                                id="paisNacimiento"
                                name="paisNacimiento"
                                value={formData.paisNacimiento}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Agregar Usuario
                    </button>
                </form>
            </div>
        </>
    );
}