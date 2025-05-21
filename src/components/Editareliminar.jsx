import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/Editareliminar.module.css';

export default function Editareliminar() {
    const [formData, setFormData] = useState({
        institucion: '',
        modalidad: '',
        numeroDocumento: '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const buscarAsistencias = () => {
        const { institucion, modalidad } = formData;

        if (!institucion || !modalidad) {
            alert('Por favor ingresa todos los datos requeridos.');
            return;
        }

        console.log('Datos del formulario:', formData);
    };

    const handleEliminar = () => {
        console.log('Eliminar acción ejecutada');
    };

    const handleEditar = () => {
        console.log('Editar acción ejecutada');
    };

    return (
        <>
            <NavBarWithButtons />
            <div className={styles.container}>
                <h1 className={styles.title}>Editar o Eliminar</h1>

                <div className={styles.searchContainer}>
                    <div>
                        <label htmlFor="tipoDocumento">Tipo de Documento</label>
                        <select
                            id="tipoDocumento"
                            value={formData.institucion} // Cambia "institucion" a "tipoDocumento" si decides renombrar la propiedad en el estado
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar Tipo de Documento</option>
                            <option value="Cedula">Cédula</option>
                            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
                            <option value="Cedula Extranjera">Cédula Extranjera</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="numeroDocumento">Número de Documento:</label>
                        <input
                            type="text"
                            id="numeroDocumento"
                            name="numeroDocumento"
                            value={formData.numeroDocumento}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={styles.searchButtonWrapper}>
                        <button onClick={buscarAsistencias}>Buscar</button>
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.deleteButton} onClick={handleEliminar}>
                        Eliminar
                    </button>
                    <button className={styles.editButton} onClick={handleEditar}>
                        Editar
                    </button>
                </div>
            </div>
        </>
    );
}