import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
// Importamos el CSS compartido
import styles from '../styles/TomarAsis.module.css';
import fondoDepantalla9 from '../assets/fondoblanco.png';

export default function EditareliminarEstudiante() {
  const [formData, setFormData] = useState({ tipoDoc: '', numDoc: '' });
  const [estuData, setEstuData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setEstuData(prev => ({ ...prev, [name]: value }));
  };

  const buscarEstudiante = async () => {
    if (!formData.tipoDoc || !formData.numDoc) {
      alert('Por favor ingresa Tipo y Número de documento.');
      return;
    }

    try {
      const resp = await fetch('http://localhost:3000/buscarEstudianteed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        alert('Error buscando estudiante: ' + errorText); // Usar errorText para más detalle
        return;
      }

      const data = await resp.json();
      if (!data.success) {
        alert(data.message || 'Estudiante no encontrado');
        setEstuData(null); // Limpiar datos si no se encuentra
        return;
      }

      // Filtrar el campo 'activo' del objeto estuData antes de establecerlo
      const { activo, ...restOfEstuData } = data.estudiante;
      setEstuData(restOfEstuData);
      setIsEditing(false);
    } catch (err) {
      alert(`Error de red al buscar estudiante: ${err.message}`);
    }
  };

  const handleEditar = async () => {
    const payload = {
      ...estuData,
      // Formatear fechaNacimiento si existe, para asegurar que se envía en formato YYYY-MM-DD
      fechaNacimiento: estuData.fechaNacimiento
          ? new Date(estuData.fechaNacimiento).toISOString().split('T')[0]
          : null,
    };

    try {
      const resp = await fetch('http://localhost:3000/editarEstudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) return alert(data.message || 'Error editando estudiante');
      alert('Estudiante editado exitosamente');
      setIsEditing(false);
    } catch (err) {
      alert(`Error de red al editar estudiante: ${err.message}`);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que quieres desactivar este estudiante?')) {
      return;
    }

    const { numDoc, tipoDoc, modalidad, dias } = estuData;
    const payload = { numDoc, tipoDoc, modalidad, dias };

    try {
      const resp = await fetch('http://localhost:3000/eliminarEstudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = resp.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await resp.text();
        throw new Error(`Respuesta no válida del servidor: ${errorText}`);
      }

      const data = await resp.json();
      if (!resp.ok) return alert(data.message || 'Error desactivando estudiante');
      alert('Estudiante desactivado exitosamente');
      setEstuData(null);
      setFormData({ tipoDoc: '', numDoc: '' });
    } catch (err) {
      alert(`Error de red al desactivar estudiante: ${err.message}`);
    }
  };

  return (
      <>
        <NavBarWithButtons />
        <div
            className={styles.mainContentWrapper} // Usamos la clase de TomarAsis.module.css
            style={{
              backgroundImage: `url(${fondoDepantalla9})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              backgroundColor: '#f0f2f5', // Color de respaldo
              color: 'white',
            }}
        >
          <div className={styles.formContainer}> {/* Usamos la clase de TomarAsis.module.css */}
            <h1 className={styles.title}>Editar o Eliminar Estudiante</h1>

            <div className={styles.searchContainer}> {/* Contenedor para búsqueda */}
              <div className={styles.formGroup}> {/* Primer campo de búsqueda */}
                <label htmlFor="tipoDoc">Tipo de Documento</label>
                <select id="tipoDoc" value={formData.tipoDoc} onChange={handleInputChange}>
                  <option value="">Seleccionar Tipo</option>
                  <option value="CC">C.C.</option>
                  <option value="TI">T.I.</option>
                  <option value="CE">C.E.</option>
                </select>
              </div>
              <div className={styles.formGroup}> {/* Segundo campo de búsqueda */}
                <label htmlFor="numDoc">Número de Documento</label>
                <input
                    id="numDoc"
                    value={formData.numDoc}
                    onChange={handleInputChange}
                    placeholder="Ingrese el número de documento"
                />
              </div>
              <div className={styles.searchButtonWrapper}> {/* Botón de búsqueda */}
                <button onClick={buscarEstudiante}>Buscar</button>
              </div>
            </div>

            {estuData && (
                <div className={styles.tableContainer}> {/* Usamos formContainer para los datos del estudiante encontrado */}
                  {/* El div para los campos de edición lo vamos a reutilizar con la misma clase del contenedor de búsqueda o una nueva similar */}
                  <div className={styles.searchContainer} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {Object.keys(estuData).map((key) => (
                        <div className={styles.formGroup} key={key}>
                          <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label> {/* Formato legible del label */}
                          {key === 'tipoDoc' || key === 'modalidad' || key === 'dias' || key === 'jornada' || key === 'sexo' || key === 'activo' ? (
                              <select
                                  name={key}
                                  value={estuData[key] || ''}
                                  onChange={handleChange}
                                  disabled={!isEditing}
                              >
                                {key === 'tipoDoc' && (
                                    <>
                                      <option value="">Seleccionar</option>
                                      <option value="CC">C.C.</option>
                                      <option value="TI">T.I.</option>
                                      <option value="CE">C.E.</option>
                                    </>
                                )}
                                {key === 'modalidad' && (
                                    <>
                                      <option value="">Seleccionar</option>
                                      <option value="Futbol">Fútbol</option>
                                      <option value="Volleyball">Volleyball</option>
                                      <option value="Basketball">Basketball</option>
                                      <option value="Recreacion">Recreación</option>
                                    </>
                                )}
                                {key === 'dias' && (
                                    <>
                                      <option value="">Seleccionar</option>
                                      <option value="LU JU">LU JU</option>
                                      <option value="LU MI">LU MI</option>
                                      <option value="LU VI">LU VI</option>
                                      <option value="MA JU">MA JU</option>
                                      <option value="MA MI">MA MI</option>
                                      <option value="MA VI">MA VI</option>
                                      <option value="MI VI">MI VI</option>
                                      <option value="SA">SA</option>
                                    </>
                                )}
                                {key === 'jornada' && (
                                    <>
                                      <option value="">Seleccionar</option>
                                      <option value="AM">AM</option>
                                      <option value="PM">PM</option>
                                    </>
                                )}
                                {key === 'sexo' && (
                                    <>
                                      <option value="">Seleccionar</option>
                                      <option value="Masculino">Masculino</option>
                                      <option value="Femenino">Femenino</option>
                                    </>
                                )}
                                {/* Si hay un campo 'activo' que se necesite mostrar, se podría añadir aquí */}
                                {key === 'activo' && (
                                    <>
                                      <option value="true">Activo</option>
                                      <option value="false">Inactivo</option>
                                    </>
                                )}
                              </select>
                          ) : (
                              <input
                                  type={key.includes('fecha') ? 'date' : 'text'} // Auto-set type to date for date fields
                                  name={key}
                                  value={
                                    key.includes('fecha') && estuData[key]
                                        ? new Date(estuData[key]).toISOString().split('T')[0]
                                        : estuData[key] || ''
                                  }
                                  onChange={handleChange}
                                  disabled={!isEditing || key === 'numDoc' || key === 'tipoDoc'} // Deshabilitar numDoc y tipoDoc
                              />
                          )}
                        </div>
                    ))}
                  </div>
                  <div className={styles.editButtonWrapper} style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                    <button
                        className={styles.editContainerbutton} // Usamos la clase del botón principal
                        onClick={isEditing ? handleEditar : () => setIsEditing(true)}
                        style={{ backgroundColor: isEditing ? '#38bdf8' : '#38bdf8' }}
                    >
                      {isEditing ? 'Guardar' : 'Editar'}
                    </button>
                    {isEditing && (
                        <button
                            className={styles.editContainerbutton} // Usamos la clase del botón principal
                            onClick={() => setIsEditing(false)}
                            style={{ backgroundColor: '#f87171' }} // Rojo para cancelar
                        >
                          Cancelar
                        </button>
                    )}
                    <button
                        className={styles.deleteButton} // Usamos la clase del botón principal
                        onClick={handleEliminar}
                        style={{ backgroundColor: '#dc2626' }} // Rojo más oscuro para eliminar
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