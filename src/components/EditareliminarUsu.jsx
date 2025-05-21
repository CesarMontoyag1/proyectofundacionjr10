// src/components/EditareliminarUsu.jsx
import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/Editareliminar.module.css';

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
            <div className={styles.container}>
                <h1 className={styles.title}>Editar o Eliminar Usuario</h1>

                <div className={styles.searchContainer}>
                    <div>
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
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="numeroDocumento">Número de Documento</label>
                        <input
                            type="text"
                            id="numeroDocumento"
                            value={formData.numeroDocumento}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.searchButtonWrapper}>
                        <button onClick={buscarUsuario}>Buscar</button>
                    </div>
                </div>

                {userData && (
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Número</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{userData.tipoDoc}</td>
                                <td>{userData.numDoc}</td>
                                <td>
                                    <input
                                        name="nombre"
                                        value={userData.nombre}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="apellido"
                                        value={userData.apellido}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="username"
                                        value={userData.username}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="email"
                                        value={userData.email}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                    />
                                </td>
                                <td>
                                    <select
                                        name="rol"
                                        value={userData.rol}
                                        onChange={handleEditChange}
                                        disabled={!isEditing}
                                    >
                                        <option value="administrativo">Administrativo</option>
                                        <option value="profesor">Profesor</option>
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.editButton}
                                onClick={() => setIsEditing(edit => !edit)}
                            >
                                {isEditing ? 'Cancelar' : 'Editar'}
                            </button>
                            {isEditing && (
                                <button
                                    className={styles.editButton}
                                    onClick={handleEditar}
                                >
                                    Guardar
                                </button>
                            )}
                            <button
                                className={styles.deleteButton}
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
