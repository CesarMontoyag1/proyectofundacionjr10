import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/AgregarEst.module.css';
import fondoDepantalla from '../assets/fondoblanco.png'; // Asegúrate de que esta ruta sea correcta

export default function AgregarEst() {
    const [formData, setFormData] = useState({
        tipoDocumento: 'CC',
        numeroDocumento: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        genero: 'M',
        fechaNacimiento: '',
        estadoCivil: 'Soltero(a)',
        grupoEtnico: '',
        factorVulnerabilidad: 'Víctima del conflicto armado (no desplazado)',
        paisNacimiento: '',
        municipioNacimiento: '',
        municipioResidencia: '',
        direccionResidencia: '',
        zonaEstudiante: 'Rural',
        mundo: '',
        modalidad: 'Fútbol',
        dias: 'LU JU',
        horarioInicio: '',
        horarioFin: '',
        codigoDaneIe: '',
        subregionIe: '',
        municipioIe: '',
        institucionEducativa: '',
        codigoDaneSede: '',
        sede: '',
        grado: '',
        jornada: 'AM',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos del formulario:', formData);
        try {
            const response = await fetch('http://localhost:3000/agregarEstudiante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    numDoc: formData.numeroDocumento,
                    tipoDoc: formData.tipoDocumento,
                    primerNombre: formData.primerNombre,
                    segundoNombre: formData.segundoNombre,
                    primerApellido: formData.primerApellido,
                    segundoApellido: formData.segundoApellido,
                    genero: formData.genero,
                    fechaNacimiento: formData.fechaNacimiento,
                    estadoCivil: formData.estadoCivil,
                    grupoEtnico: formData.grupoEtnico,
                    factorVulnerabilidad: formData.factorVulnerabilidad,
                    paisNacimiento: formData.paisNacimiento,
                    municipioNacimiento: formData.municipioNacimiento,
                    municipioResidencia: formData.municipioResidencia,
                    direccionResidencia: formData.direccionResidencia,
                    zonaEstudiante: formData.zonaEstudiante,
                    mundo: formData.mundo,
                    modalidad: formData.modalidad,
                    dias: formData.dias,
                    horarioInicio: formData.horarioInicio,
                    horarioFin: formData.horarioFin,
                    codigoDaneIE: formData.codigoDaneIe,
                    subregionIE: formData.subregionIe,
                    municipioIE: formData.municipioIe,
                    institucionEducativa: formData.institucionEducativa,
                    codigoDaneSede: formData.codigoDaneSede,
                    sede: formData.sede,
                    grado: formData.grado,
                    jornada: formData.jornada,
                    nit: formData.nit,
                    proveedor: formData.proveedor,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || 'Estudiante agregado exitosamente');
                // Limpiar el formulario después de un envío exitoso
                setFormData({
                    tipoDocumento: 'CC',
                    numeroDocumento: '',
                    primerNombre: '',
                    segundoNombre: '',
                    primerApellido: '',
                    segundoApellido: '',
                    genero: 'M',
                    fechaNacimiento: '',
                    estadoCivil: 'Soltero(a)',
                    grupoEtnico: '',
                    factorVulnerabilidad: 'Víctima del conflicto armado (no desplazado)',
                    paisNacimiento: '',
                    municipioNacimiento: '',
                    municipioResidencia: '',
                    direccionResidencia: '',
                    zonaEstudiante: 'Rural',
                    mundo: '',
                    modalidad: 'Fútbol',
                    dias: 'LU JU',
                    horarioInicio: '',
                    horarioFin: '',
                    codigoDaneIe: '',
                    subregionIe: '',
                    municipioIe: '',
                    institucionEducativa: '',
                    codigoDaneSede: '',
                    sede: '',
                    grado: '',
                    jornada: 'AM',
                    nit: '',
                    proveedor: '',
                });
            } else {
                alert(result.message || 'Error al agregar el estudiante');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <>
            <NavBarWithButtons />
            <div
                className={styles.pageContainer}
                style={{
                    backgroundImage: `url(${fondoDepantalla})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed', // Para que el fondo sea fijo
                }}
            >
                <div className={styles.formWrapper}>
                    <h1 className={styles.title}>Registrar Nuevo Estudiante</h1>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formColumn}>
                            <h2 className={styles.sectionTitle}>Datos Personales del Estudiante</h2>

                            <div className={styles.inputGroup}>
                                <label htmlFor="tipoDocumento">Tipo de Documento</label>
                                <select
                                    id="tipoDocumento"
                                    name="tipoDocumento"
                                    value={formData.tipoDocumento}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="CC">C.C.</option>
                                    <option value="TI">T.I.</option>
                                    <option value="RC">R.C.</option>
                                    <option value="CE">C.E.</option>
                                    <option value="NUIP">NUIP</option>
                                    <option value="PASAPORTE">PASAPORTE</option>
                                    <option value="NIT">NIT</option>
                                    <option value="CARNE_DIPLOMATICO">CARNÉ DIPLOMÁTICO</option>
                                    <option value="PEP">PERMISO ESPECIAL DE PERMANENCIA (P.E.P)</option>
                                    <option value="CERTIFICADO_CABILDO">CERTIFICADO CABILDO</option>
                                    <option value="NES">NES</option>
                                    <option value="TMF">TARJETA DE MOVILIDAD FRONTERIZA (TMF)</option>
                                    <option value="VISA">VISA</option>
                                    <option value="ID_EXTRANJEROS">ID EXTRANJEROS DIFERENTE A LA CÉDULA DE EXTRANJERÍA</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="numeroDocumento">Número de Documento</label>
                                <input
                                    type="text"
                                    id="numeroDocumento"
                                    name="numeroDocumento"
                                    value={formData.numeroDocumento}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="primerNombre">Primer Nombre</label>
                                <input
                                    type="text"
                                    id="primerNombre"
                                    name="primerNombre"
                                    value={formData.primerNombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="segundoNombre">Segundo Nombre</label>
                                <input
                                    type="text"
                                    id="segundoNombre"
                                    name="segundoNombre"
                                    value={formData.segundoNombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="primerApellido">Primer Apellido</label>
                                <input
                                    type="text"
                                    id="primerApellido"
                                    name="primerApellido"
                                    value={formData.primerApellido}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="segundoApellido">Segundo Apellido</label>
                                <input
                                    type="text"
                                    id="segundoApellido"
                                    name="segundoApellido"
                                    value={formData.segundoApellido}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="genero">Género</label>
                                <select
                                    id="genero"
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
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

                        <div className={styles.formColumn}>
                            <h2 className={styles.sectionTitle}>Información Adicional</h2>

                            <div className={styles.inputGroup}>
                                <label htmlFor="estadoCivil">Estado Civil</label>
                                <select
                                    id="estadoCivil"
                                    name="estadoCivil"
                                    value={formData.estadoCivil}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Soltero(a)">Soltero(a)</option>
                                    <option value="Casado(a)">Casado(a)</option>
                                    <option value="Divorciado(a)">Divorciado(a)</option>
                                    <option value="Separación en proceso judicial">Separación en proceso judicial</option>
                                    <option value="Viudo(a)">Viudo(a)</option>
                                    <option value="Concubinato">Concubinato</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="grupoEtnico">Grupo Étnico</label>
                                <input
                                    type="text"
                                    id="grupoEtnico"
                                    name="grupoEtnico"
                                    value={formData.grupoEtnico}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="factorVulnerabilidad">Factor de Vulnerabilidad</label>
                                <select
                                    id="factorVulnerabilidad"
                                    name="factorVulnerabilidad"
                                    value={formData.factorVulnerabilidad}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Víctima del conflicto armado (no desplazado)">Víctima del conflicto armado (no desplazado)</option>
                                    <option value="Desplazado">Desplazado</option>
                                    <option value="Hijo (as) de madres cabeza de familia">Hijo (as) de madres cabeza de familia</option>
                                    <option value="Población migrante">Población migrante</option>
                                    <option value="No aplica">No aplica</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="paisNacimiento">País de Nacimiento</label>
                                <input
                                    type="text"
                                    id="paisNacimiento"
                                    name="paisNacimiento"
                                    value={formData.paisNacimiento}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="municipioNacimiento">Municipio de Nacimiento</label>
                                <input
                                    type="text"
                                    id="municipioNacimiento"
                                    name="municipioNacimiento"
                                    value={formData.municipioNacimiento}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="municipioResidencia">Municipio de Residencia</label>
                                <input
                                    type="text"
                                    id="municipioResidencia"
                                    name="municipioResidencia"
                                    value={formData.municipioResidencia}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="direccionResidencia">Dirección de Residencia</label>
                                <input
                                    type="text"
                                    id="direccionResidencia"
                                    name="direccionResidencia"
                                    value={formData.direccionResidencia}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="zonaEstudiante">Zona del Estudiante</label>
                                <select
                                    id="zonaEstudiante"
                                    name="zonaEstudiante"
                                    value={formData.zonaEstudiante}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Rural">Rural</option>
                                    <option value="Urbana">Urbana</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <h2 className={styles.sectionTitle}>Detalles de Programa y Horario</h2>

                            <div className={styles.inputGroup}>
                                <label htmlFor="mundo">Mundo</label>
                                <input
                                    type="text"
                                    id="mundo"
                                    name="mundo"
                                    value={formData.mundo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="modalidad">Modalidad</label>
                                <select
                                    id="modalidad"
                                    name="modalidad"
                                    value={formData.modalidad}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Futbol">Fútbol</option>
                                    <option value="Volleyball">Volleyball</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Recreacion">Recreación</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="dias">Días</label>
                                <select
                                    id="dias"
                                    name="dias"
                                    value={formData.dias}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="LU JU">LU JU</option>
                                    <option value="LU MI">LU MI</option>
                                    <option value="LU VI">LU VI</option>
                                    <option value="MA JU">MA JU</option>
                                    <option value="MA MI">MA MI</option>
                                    <option value="MA VI">MA VI</option>
                                    <option value="MI VI">MI VI</option>
                                    <option value="SA">SA</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="horarioInicio">Horario Inicio</label>
                                <input
                                    type="time"
                                    id="horarioInicio"
                                    name="horarioInicio"
                                    value={formData.horarioInicio}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="horarioFin">Horario Fin</label>
                                <input
                                    type="time"
                                    id="horarioFin"
                                    name="horarioFin"
                                    value={formData.horarioFin}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="nit">NIT</label>
                                <input
                                    type="text"
                                    id="nit"
                                    name="nit"
                                    value={formData.nit}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="proveedor">Proveedor</label>
                                <input
                                    type="text"
                                    id="proveedor"
                                    name="proveedor"
                                    value={formData.proveedor}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Contenedor específico para Información Educativa con layout horizontal */}
                        <div className={`${styles.formColumn} ${styles.educationalSection}`}>
                            <h2 className={styles.sectionTitle}>Información Educativa</h2>
                            <div className={styles.educationalGrid}> {/* Nuevo contenedor para el grid interno */}
                                <div className={styles.inputGroup}>
                                    <label htmlFor="codigoDaneIe">Código DANE IE</label>
                                    <input
                                        type="text"
                                        id="codigoDaneIe"
                                        name="codigoDaneIe"
                                        value={formData.codigoDaneIe}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="subregionIe">Subregión IE</label>
                                    <input
                                        type="text"
                                        id="subregionIe"
                                        name="subregionIe"
                                        value={formData.subregionIe}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="municipioIe">Municipio IE</label>
                                    <input
                                        type="text"
                                        id="municipioIe"
                                        name="municipioIe"
                                        value={formData.municipioIe}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="institucionEducativa">Institución Educativa</label>
                                    <input
                                        type="text"
                                        id="institucionEducativa"
                                        name="institucionEducativa"
                                        value={formData.institucionEducativa}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="codigoDaneSede">Código DANE Sede</label>
                                    <input
                                        type="text"
                                        id="codigoDaneSede"
                                        name="codigoDaneSede"
                                        value={formData.codigoDaneSede}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="sede">Sede</label>
                                    <input
                                        type="text"
                                        id="sede"
                                        name="sede"
                                        value={formData.sede}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="grado">Grado</label>
                                    <input
                                        type="text"
                                        id="grado"
                                        name="grado"
                                        value={formData.grado}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="jornada">Jornada</label>
                                    <select
                                        id="jornada"
                                        name="jornada"
                                        value={formData.jornada}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div> {/* Fin educationalGrid */}
                        </div> {/* Fin educationalSection */}

                        <button type="submit" className={styles.submitButton}>
                            <i className="fas fa-user-plus"></i> Agregar Estudiante
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}