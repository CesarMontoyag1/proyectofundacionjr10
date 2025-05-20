import React, { useState, useEffect } from 'react';
import styles from '../styles/TomarAsis.module.css';
import NavBarWithButtons from './NavBarWithButtons';

const TomarAsistencia = () => {
    const [instituciones, setInstituciones] = useState([]);
    const [formData, setFormData] = useState({
        fecha: '',
        institucion: '',
        modalidad: '',
        dias: '',
    });
    const [estudiantes, setEstudiantes] = useState([]);
    const [mostrarTabla, setMostrarTabla] = useState(false);

    useEffect(() => {
        // Llamada al backend para obtener las instituciones
        fetch('http://localhost:3000/obtenerInstituciones')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener las instituciones');
                }
                return response.json();
            })
            .then((data) => setInstituciones(data))
            .catch((error) => console.error('Error al cargar instituciones:', error));
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const buscarAsistencia = () => {
        const { fecha, institucion, modalidad, dias } = formData;

        if (!fecha || !institucion || !modalidad || !dias) {
            alert('Por favor ingresa todos los datos requeridos.');
            return;
        }

        fetch('http://localhost:3000/obtenerEstudiantesPorInstitucion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ institucion, modalidad, dias }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener estudiantes');
                }
                return response.json();
            })
            .then((data) => {
                setEstudiantes(data);
                setMostrarTabla(data.length > 0);
            })
            .catch((error) => console.error('Error al obtener estudiantes:', error));
    };

    const registrarAsistencia = () => {
        const asistencias = estudiantes.map((estudiante) => ({
            numDoc: estudiante.numDoc,
            tipoDoc: estudiante.tipoDoc,
            modalidad: estudiante.modalidad,
            dias: estudiante.dias,
            asistio: document.querySelector(`#checkbox-${estudiante.numDoc}`).checked,
        }));

        fetch('http://localhost:3000/registrarAsistencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha: formData.fecha, asistencias }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al registrar asistencia');
                }
                return response.json();
            })
            .then((data) => alert(data.mensaje || 'Asistencia registrada correctamente'))
            .catch((error) => console.error('Error al registrar asistencia:', error));
    };

    return (
        <div className={styles.container}>
            <NavBarWithButtons />

            <header className={styles.header}>
                <h1 className={styles.title}>Tomar Asistencia</h1>
            </header>

            <div className={styles.searchContainer}>
                <div>
                    <label htmlFor="fecha">Fecha</label>
                    <input type="date" id="fecha" value={formData.fecha} onChange={handleInputChange} />
                </div>
                <div>
                    <label htmlFor="institucion">Institución</label>
                    <select
                        id="institucion"
                        value={formData.institucion}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccionar Institución</option>
                        {instituciones.map((inst) => (
                            <option key={inst.nombre} value={inst.nombre}>
                                {inst.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="modalidad">Modalidad</label>
                    <select id="modalidad" value={formData.modalidad} onChange={handleInputChange}>
                        <option value="">Seleccionar Modalidad</option>
                        <option value="Futbol">Fútbol</option>
                        <option value="Volleyball">Volleyball</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Recreacion">Recreación</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dias">Días</label>
                    <select id="dias" value={formData.dias} onChange={handleInputChange}>
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
                <div className={styles.searchButtonWrapper}>
                    <button onClick={buscarAsistencia}>Buscar</button>
                </div>
            </div>

            {mostrarTabla && (
                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Nombre</th>
                            <th>Modalidad</th>
                            <th>Días</th>
                            <th>Asistió</th>
                        </tr>
                        </thead>
                        <tbody>
                        {estudiantes.map((estudiante) => (
                            <tr key={estudiante.numDoc}>
                                <td>{estudiante.numDoc}</td>
                                <td>{`${estudiante.primerNombre} ${estudiante.primerApellido}`}</td>
                                <td>{estudiante.modalidad}</td>
                                <td>{estudiante.dias}</td>
                                <td>
                                    <input type="checkbox" id={`checkbox-${estudiante.numDoc}`} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button
                        className={styles.registrarAsistenciaButton}
                        onClick={registrarAsistencia}
                    >
                        Registrar Asistencia
                    </button>
                </div>
            )}
        </div>
    );
};

export default TomarAsistencia;