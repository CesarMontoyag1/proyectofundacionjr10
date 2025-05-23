import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
// ¡Importamos el CSS compartido!
import styles from '../styles/TomarAsis.module.css';
import fondoDepantalla10 from '../assets/fondoblanco.png';

export default function EditareliminarUsu() {
    const [formData, setFormData] = useState({
        tipoDocumento: '',
        numeroDocumento: '',
    });
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const buscarUsuario = async () => {
        const { tipoDocumento, numeroDocumento } = formData;
        if (!tipoDocumento || !numeroDocumento) {
            return alert('Por favor ingresa todos los datos requeridos.');
        }

        console.log('buscarUsuario → envío:', formData);
        try {
            const resp = await fetch('http://localhost:3000/buscarUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipoDocumento, numeroDocumento }),
            });
            const data = await resp.json();
            console.log('buscarUsuario → respuesta:', data);

            if (!resp.ok) {
                setUserData(null);
                return alert(data.message || 'Usuario no encontrado');
            }
            setUserData(data.usuario);
            setIsEditing(false);
        } catch (err) {
            console.error('Error de red en buscarUsuario:', err);
            alert('Error al buscar usuario');
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditar = async () => {
        if (!userData) return;

        // Validar que los campos críticos no estén vacíos
        if (!userData.nombre || !userData.apellido || !userData.username || !userData.email || !userData.rol) {
            alert('Todos los campos son obligatorios. Por favor, completa la información.');
            return;
        }

        const payload = {
            numDoc: userData.numDoc,
            tipoDoc: userData.tipoDoc,
            nombre: userData.nombre,
            apellido: userData.apellido,
            username: userData.username,
            email: userData.email,
            rol: userData.rol,
        };
        console.log('handleEditar → envío:', payload);

        try {
            const resp = await fetch('http://localhost:3000/editarUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            console.log('handleEditar → respuesta:', data);

            if (!resp.ok) {
                return alert(data.message || 'Error al editar usuario');
            }
            alert('Usuario editado exitosamente');
            setIsEditing(false);
        } catch (err) {
            console.error('Error de red en editarUsuario:', err);
            alert('Error al editar usuario');
        }
    };

    const handleEliminar = async () => {
        if (!userData) return;
        // Confirmación antes de eliminar
        if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
            return;
        }

        const payload = { numDoc: userData.numDoc, tipoDoc: userData.tipoDoc };
        console.log('handleEliminar → envío:', payload);

        try {
            const resp = await fetch('http://localhost:3000/eliminarUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await resp.json();
            console.log('handleEliminar → respuesta:', data);

            if (!resp.ok) {
                return alert(data.message || 'Error al eliminar usuario');
            }
            alert('Usuario eliminado exitosamente');
            setUserData(null);
            setFormData({ tipoDocumento: '', numeroDocumento: '' });
        } catch (err) {
            console.error('Error de red en eliminarUsuario:', err);
            alert('Error al eliminar usuario');
        }
    };

    return (
        <>
            <NavBarWithButtons />
            <div
                className={styles.mainContentWrapper} // Usamos la clase de TomarAsis.module.css
                style={{
                    backgroundImage: `url(${fondoDepantalla10})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundColor: '#f0f2f5', // Color de respaldo
                    color: 'white',
                }}
            >
                <div className={styles.formContainer}> {/* Usamos la clase de TomarAsis.module.css */}
                    <h1 className={styles.title}>Editar o Eliminar Usuario</h1>

                    <div className={styles.searchContainer}> {/* Contenedor para búsqueda */}
                        <div className={styles.formGroup}> {/* Primer campo de búsqueda */}
                            <label htmlFor="tipoDocumento">Tipo de Documento</label>
                            <select
                                id="tipoDocumento"
                                value={formData.tipoDocumento}
                                onChange={handleInputChange}
                            >
                                <option value="">Seleccionar Tipo</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="TI">Tarjeta de Identidad</option>
                                <option value="CE">Cédula de Extranjería</option>
                                {/* <option value="Otro">Otro</option> // Si es necesario, añadir en la base de datos */}
                            </select>
                        </div>
                        <div className={styles.formGroup}> {/* Segundo campo de búsqueda */}
                            <label htmlFor="numeroDocumento">Número de Documento</label>
                            <input
                                type="text"
                                id="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleInputChange}
                                placeholder="Ingrese el número de documento"
                            />
                        </div>
                        <div className={styles.searchButtonWrapper}> {/* Botón de búsqueda */}
                            <button onClick={buscarUsuario}>Buscar</button>
                        </div>
                    </div>

                    {userData && (
                        <div className={styles.tableContainer}> {/* Usamos tableContainer para mostrar los datos editables */}
                            <div className={styles.searchContainer} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                {/* Los datos del usuario se muestran como formGroup individuales */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="tipoDoc">Tipo de Documento</label>
                                    <select
                                        name="tipoDoc"
                                        value={userData.tipoDoc}
                                        onChange={handleEditChange}
                                        disabled={!isEditing || userData.tipoDoc} // Deshabilitar si no se está editando o si ya tiene un valor (para evitar cambios en el ID)
                                    >
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                        {/* <option value="Otro">Otro</option> */}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="numDoc">Número de Documento</label>
                                    <input
                                        type="text"
                                        name="numDoc"
                                        value={userData.numDoc}
                                        onChange={handleEditChange}
                                        disabled={!isEditing || userData.numDoc} // Deshabilitar si no se está editando o si ya tiene un valor
                                        readOnly // Solo lectura para el campo de documento una vez cargado
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={userData.nombre}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                        placeholder="Nombre"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="apellido">Apellido</label>
                                    <input
                                        type="text"
                                        name="apellido"
                                        value={userData.apellido}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                        placeholder="Apellido"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="username">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={userData.username}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                        placeholder="Nombre de Usuario"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                        placeholder="Correo Electrónico"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="rol">Rol</label>
                                    <select
                                        name="rol"
                                        value={userData.rol}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                    >
                                        <option value="administrativo">Administrativo</option>
                                        <option value="profesor">Profesor</option>
                                        {/* Agrega otros roles si existen */}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.editButtonWrapper} style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                                <button
                                    className={styles.editContainerbutton}
                                    onClick={() => setIsEditing(edit => !edit)}
                                    style={{ backgroundColor: isEditing ? '#f87171' : '#38bdf8' }} // Rojo para Cancelar, Azul para Editar
                                >
                                    {isEditing ? 'Cancelar' : 'Editar'}
                                </button>
                                {isEditing && (
                                    <button
                                        className={styles.editContainerbutton}
                                        onClick={handleEditar}
                                        style={{ backgroundColor: '#38bdf8' }} // Azul para Guardar
                                    >
                                        Guardar
                                    </button>
                                )}
                                <button
                                    className={styles.deleteButton}
                                    onClick={handleEliminar}
                                    style={{ backgroundColor: '#dc2626' }} // Rojo más oscuro para Eliminar
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}