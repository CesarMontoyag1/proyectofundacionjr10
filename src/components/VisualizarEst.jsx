import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/TomarAsis.module.css'; // ¡Usamos el CSS de TomarAsis!
import fondoDepantalla from '../assets/fondoblanco.png'; // Importamos la imagen de fondo

const VisualizarEst = () => {
    const [documento, setDocumento] = useState('');
    const [estudiante, setEstudiante] = useState(null);

    const handleInputChange = (e) => {
        setDocumento(e.target.value);
    };

    const buscarEstudiante = async () => {
        if (!documento) {
            alert('Por favor ingresa un documento de identidad.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/buscarEstudiante', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documento }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                alert(errorMessage || 'Error al buscar el estudiante.');
                return;
            }

            const data = await response.json();
            setEstudiante({
                nombre: `${data.estudiante.primerNombre} ${data.estudiante.segundoNombre || ''} ${data.estudiante.primerApellido} ${data.estudiante.segundoApellido || ''}`.trim(),
                documento: data.estudiante.numDoc,
                asistencias: data.asistencias,
                inasistencias: data.inasistencias,
            });
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Error al conectar con el servidor.');
        }
    };

    return (
        <>
            <NavBarWithButtons />

            <div
                className={styles.mainContentWrapper}
                style={{
                    backgroundImage: `url(${fondoDepantalla})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundColor: '#f0f2f5',
                    color: 'white',
                }}
            >
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Visualizar Estudiante</h1>

                    <div className={styles.searchContainer}>
                        {/* AHORA USAMOS styles.formGroup para el campo de documento */}
                        <div className={styles.formGroup}>
                            <label htmlFor="documento">Documento de Identidad</label>
                            <input
                                type="text"
                                id="documento"
                                value={documento}
                                onChange={handleInputChange}
                                placeholder="Ingrese el número de documento"
                            />
                        </div>
                        <div className={styles.searchButtonWrapper}>
                            <button onClick={buscarEstudiante}>Buscar</button>
                        </div>
                    </div>

                    {estudiante && (
                        <div className={styles.tableContainer}>
                            <table>
                                <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Documento</th>
                                    <th>Asistencias</th>
                                    <th>Inasistencias</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{estudiante.nombre}</td>
                                    <td>{estudiante.documento}</td>
                                    <td>{estudiante.asistencias}</td>
                                    <td>{estudiante.inasistencias}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VisualizarEst;