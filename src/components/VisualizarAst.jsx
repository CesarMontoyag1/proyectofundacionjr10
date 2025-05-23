import React, { useState, useEffect } from 'react';
import styles from '../styles/TomarAsis.module.css';
import NavBarWithButtons from './NavBarWithButtons';
import fondoDepantalla from '../assets/fondoblanco.png'; // ¡Re-importamos el fondo aquí!

const VisualizarAst = () => {
    const [instituciones, setInstituciones] = useState([]);
    const [formData, setFormData] = useState({
        fecha: '',
        institucion: '',
        modalidad: '',
        dias: '',
    });
    const [asistencias, setAsistencias] = useState([]);
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

    const buscarAsistencias = () => {
        const { fecha, institucion, modalidad, dias } = formData;

        if (!fecha || !institucion || !modalidad || !dias) {
            alert('Por favor ingresa todos los datos requeridos.');
            return;
        }

        fetch('http://localhost:3000/consultarAsistencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha, institucion, modalidad, dias }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener asistencias');
                }
                return response.json();
            })
            .then((data) => {
                setAsistencias(data);
                setMostrarTabla(data.length > 0);
            })
            .catch((error) => console.error('Error al obtener asistencias:', error));
    };

    return (
        <>
            <NavBarWithButtons />

            <div
                className={styles.mainContentWrapper}
                style={{
                    backgroundImage: `url(${fondoDepantalla})`, // Aplicamos el fondo aquí
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed', // Para que el fondo no se mueva
                    backgroundColor: '#f0f2f5', // Color de respaldo
                    color: 'white', // Color de texto general para el contenedor
                }}
            >
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Visualizar Asistencias</h1>

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
                                <option value="">Seleccionar Días</option>
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
                            <button onClick={buscarAsistencias}>Buscar</button>
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
                                {asistencias.map((asistencia) => (
                                    <tr key={`${asistencia.numDoc}-${asistencia.fecha}`}>
                                        <td>{asistencia.numDoc}</td>
                                        <td>{`${asistencia.primerNombre} ${asistencia.primerApellido}`}</td>
                                        <td>{asistencia.modalidad}</td>
                                        <td>{asistencia.dias}</td>
                                        <td>{asistencia.asistio ? 'Sí' : 'No'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VisualizarAst;