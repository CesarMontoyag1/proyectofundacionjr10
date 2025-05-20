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
        mundo: '',
        modalidad: '',
        dias: '',
        horarioInicio: '',
        horarioFin: '',
        codigoDaneIe: '',
        subregionIe: '',
        municipioIe: '',
        institucionEducativa: '',
        codigoDaneSede: '',
        sede: '',
        grado: '',
        jornada: '',
        nit: '',
        proveedor: '',
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
                        <h2 className={styles.sectionTitle}>INFORMACIÓN ADICIONAL</h2>

                        <div className={styles.formGroup}>
                            <label htmlFor="mundo">Mundo:</label>
                            <input
                                type="text"
                                id="mundo"
                                name="mundo"
                                value={formData.mundo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="modalidad">Modalidad:</label>
                            <select
                                id="modalidad"
                                name="modalidad"
                                value={formData.modalidad}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="voleibol">Voleibol</option>
                                <option value="basquetbol">Básquetbol</option>
                                <option value="futbol">Fútbol</option>
                                <option value="recreacion">Recreación</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="dias">Días:</label>
                            <select
                                id="dias"
                                name="dias"
                                value={formData.dias}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="Lunes-Miercoles">Lunes-Miércoles</option>
                                <option value="Lunes-Jueves">Lunes-Jueves</option>
                                <option value="Lunes-Viernes">Lunes-Viernes</option>
                                <option value="Martes-Miercoles">Martes-Miércoles</option>
                                <option value="Martes-Jueves">Martes-Jueves</option>
                                <option value="Miercoles-Viernes">Miércoles-Viernes</option>
                                <option value="Sabado">Sábado</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="horarioInicio">Horario Inicio:</label>
                            <input
                                type="time"
                                id="horarioInicio"
                                name="horarioInicio"
                                value={formData.horarioInicio}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="horarioFin">Horario Fin:</label>
                            <input
                                type="time"
                                id="horarioFin"
                                name="horarioFin"
                                value={formData.horarioFin}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="nit">NIT:</label>
                            <input
                                type="text"
                                id="nit"
                                name="nit"
                                value={formData.nit}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="proveedor">Proveedor:</label>
                            <input
                                type="text"
                                id="proveedor"
                                name="proveedor"
                                value={formData.proveedor}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className={styles.column}>
                        <h2 className={`${styles.sectionTitle} ${styles.customTitle}`}> . </h2>

                        <div className={styles.formGroup}>
                            <label htmlFor="estadoCivil">Estado Civil:</label>
                            <select
                                id="estadoCivil"
                                name="estadoCivil"
                                value={formData.estadoCivil}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="Soltero(a)">Soltero(a)</option>
                                <option value="Casado(a)">Casado(a)</option>
                                <option value="Divorciado(a)">Divorciado(a)</option>
                                <option value="Separación en proceso judicial">Separación en proceso judicial</option>
                                <option value="Viudo(a)">Viudo(a)</option>
                                <option value="Concubinato">Concubinato</option>
                            </select>
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
                            <select
                                id="factorVulnerabilidad"
                                name="factorVulnerabilidad"
                                value={formData.factorVulnerabilidad}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="Víctima del conflicto armado (no desplazado)">Víctima del conflicto armado (no desplazado)</option>
                                <option value="Desplazado">Desplazado</option>
                                <option value="Hijo (as) de madres cabeza de familia">Hijo (as) de madres cabeza de familia</option>
                                <option value="Población migrante">Población migrante</option>
                                <option value="No aplica">No aplica</option>
                            </select>
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
                            <select
                                id="zonaEstudiante"
                                name="zonaEstudiante"
                                value={formData.zonaEstudiante}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="Rural">Rural</option>
                                <option value="Urbana">Urbana</option>
                            </select>
                        </div>
                        <h2 className={`${styles.sectionTitle} ${styles.customTitle}`}> . </h2>
                        <div className={styles.formGroup}>
                            <label htmlFor="codigoDaneIe">Código DANE IE:</label>
                            <input
                                type="text"
                                id="codigoDaneIe"
                                name="codigoDaneIe"
                                value={formData.codigoDaneIe}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="subregionIe">Subregión IE:</label>
                            <input
                                type="text"
                                id="subregionIe"
                                name="subregionIe"
                                value={formData.subregionIe}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="municipioIe">Municipio IE:</label>
                            <input
                                type="text"
                                id="municipioIe"
                                name="municipioIe"
                                value={formData.municipioIe}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="institucionEducativa">Institución Educativa:</label>
                            <input
                                type="text"
                                id="institucionEducativa"
                                name="institucionEducativa"
                                value={formData.institucionEducativa}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="codigoDaneSede">Código DANE Sede:</label>
                            <input
                                type="text"
                                id="codigoDaneSede"
                                name="codigoDaneSede"
                                value={formData.codigoDaneSede}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="sede">Sede:</label>
                            <input
                                type="text"
                                id="sede"
                                name="sede"
                                value={formData.sede}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="grado">Grado:</label>
                            <input
                                type="text"
                                id="grado"
                                name="grado"
                                value={formData.grado}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="jornada">Jornada:</label>
                            <select
                                id="jornada"
                                name="jornada"
                                value={formData.jornada}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
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