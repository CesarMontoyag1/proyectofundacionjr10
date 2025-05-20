import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/AgregarEst.module.css';

export default function AgregarEst() {
    const [formData, setFormData] = useState({
        tipoDocumento: '',
        numeroDocumento: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        genero: '',
        fechaNacimiento: '',
        estadoCivil: '',
        grupoEtnico: '',
        factorVulnerabilidad: '',
        paisNacimiento: '',
        municipioNacimiento: '',
        municipioResidencia: '',
        direccionResidencia: '',
        zonaEstudiante: '',
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
                <h1 className={styles.title}>Agregar Estudiante</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.column}>
                        <h2 className={styles.sectionTitle}>DATOS PERSONALES DEL ESTUDIANTE</h2>
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
                            <label htmlFor="primerNombre">Primer Nombre:</label>
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
                            <label htmlFor="segundoNombre">Segundo Nombre:</label>
                            <input
                                type="text"
                                id="segundoNombre"
                                name="segundoNombre"
                                value={formData.segundoNombre}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="primerApellido">Primer Apellido:</label>
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
                            <label htmlFor="segundoApellido">Segundo Apellido:</label>
                            <input
                                type="text"
                                id="segundoApellido"
                                name="segundoApellido"
                                value={formData.segundoApellido}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="genero">Género:</label>
                            <select
                                id="genero"
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.column}>
                        <div className={styles.formGroup}>
                            <label htmlFor="estadoCivil">Estado Civil:</label>
                            <input
                                type="text"
                                id="estadoCivil"
                                name="estadoCivil"
                                value={formData.estadoCivil}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="grupoEtnico">Grupo Étnico:</label>
                            <input
                                type="text"
                                id="grupoEtnico"
                                name="grupoEtnico"
                                value={formData.grupoEtnico}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="factorVulnerabilidad">Factor de Vulnerabilidad:</label>
                            <input
                                type="text"
                                id="factorVulnerabilidad"
                                name="factorVulnerabilidad"
                                value={formData.factorVulnerabilidad}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="paisNacimiento">País de Nacimiento:</label>
                            <input
                                type="text"
                                id="paisNacimiento"
                                name="paisNacimiento"
                                value={formData.paisNacimiento}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="municipioNacimiento">Municipio de Nacimiento:</label>
                            <input
                                type="text"
                                id="municipioNacimiento"
                                name="municipioNacimiento"
                                value={formData.municipioNacimiento}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="municipioResidencia">Municipio de Residencia:</label>
                            <input
                                type="text"
                                id="municipioResidencia"
                                name="municipioResidencia"
                                value={formData.municipioResidencia}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="direccionResidencia">Dirección de Residencia:</label>
                            <input
                                type="text"
                                id="direccionResidencia"
                                name="direccionResidencia"
                                value={formData.direccionResidencia}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="zonaEstudiante">Zona del Estudiante:</label>
                            <input
                                type="text"
                                id="zonaEstudiante"
                                name="zonaEstudiante"
                                value={formData.zonaEstudiante}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Agregar Estudiante
                    </button>
                </form>
            </div>
        </>
    );
}