import React, { useState } from 'react';
import NavBarWithButtons from './NavBarWithButtons';
import styles from '../styles/Editareliminar.module.css';
import formStyles from '../styles/EditareliminarForm.module.css';
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
        alert('Error buscando estudiante: ' + resp.statusText);
        return;
      }

      const data = await resp.json();
      if (!data.success) {
        alert(data.message || 'Estudiante no encontrado');
        return;
      }

      delete data.estudiante.activo; // Excluir el campo 'activo'
      setEstuData(data.estudiante);
      setIsEditing(false);
    } catch (err) {
      alert(`Error de red al buscar estudiante: ${err.message}`);
    }
  };

  const handleEditar = async () => {
    const payload = {
      ...estuData,
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
    const { numDoc, tipoDoc, modalidad, dias } = estuData;
    const payload = { numDoc, tipoDoc, modalidad, dias };
    try {
      const resp = await fetch('http://localhost:3000/eliminarEstudiante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) return alert(data.message || 'Error eliminando estudiante');
      alert('Estudiante desactivado exitosamente');
      setEstuData(null);
      setFormData({ tipoDoc: '', numDoc: '' });
    } catch (err) {
      alert(`Error de red al eliminar estudiante: ${err.message}`);
    }
  };

  return (
      <>
        <NavBarWithButtons />
        <div
            className={styles.container}
            style={{
              backgroundImage: `url(${fondoDepantalla9})`, // Asegúrate de importar la imagen
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
            }}
        >
          <h1 className={styles.title}>Editar o Eliminar Estudiante</h1>

          <div className={styles.searchContainer}>
            <div>
              <label htmlFor="tipoDoc">Tipo de Documento</label>
              <select id="tipoDoc" value={formData.tipoDoc} onChange={handleInputChange}>
                <option value="">Seleccionar Tipo</option>
                <option value="CC">C.C.</option>
                <option value="TI">T.I.</option>
                <option value="CE">C.E.</option>
              </select>
            </div>
            <div>
              <label htmlFor="numDoc">Número de Documento</label>
              <input id="numDoc" value={formData.numDoc} onChange={handleInputChange} />
            </div>
            <div className={styles.searchButtonWrapper}>
              <button onClick={buscarEstudiante}>Buscar</button>
            </div>
          </div>

          {estuData && (
              <div className={formStyles.formContainer}>
                <div className={formStyles.gridContainer}>
                  {Object.keys(estuData).map((key) => (
                      <div className={formStyles.gridItem} key={key}>
                        <label htmlFor={key}>{key}</label>
                        {key === 'tipoDoc' || key === 'modalidad' || key === 'dias' || key === 'jornada' ? (
                            <select
                                name={key}
                                value={estuData[key] || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            >
                              {key === 'tipoDoc' && (
                                  <>
                                    <option value="CC">C.C.</option>
                                    <option value="TI">T.I.</option>
                                    <option value="CE">C.E.</option>
                                  </>
                              )}
                              {key === 'modalidad' && (
                                  <>
                                    <option value="Fútbol">Fútbol</option>
                                    <option value="Baloncesto">Baloncesto</option>
                                  </>
                              )}
                              {key === 'dias' && (
                                  <>
                                    <option value="LU VI">LU VI</option>
                                    <option value="MA MI">MA MI</option>
                                  </>
                              )}
                              {key === 'jornada' && (
                                  <>
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                  </>
                              )}
                            </select>
                        ) : (
                            <input
                                name={key}
                                value={estuData[key] || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        )}
                      </div>
                  ))}
                </div>
                <div className={formStyles.buttonContainer}>
                  <button
                      className={formStyles.saveButton}
                      onClick={isEditing ? handleEditar : () => setIsEditing(true)}
                  >
                    {isEditing ? 'Guardar' : 'Editar'}
                  </button>
                  {isEditing && (
                      <button
                          className={formStyles.cancelButton}
                          onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </button>
                  )}
                  <button className={formStyles.cancelButton} onClick={handleEliminar}>
                    Eliminar
                  </button>
                </div>
              </div>
          )}
        </div>
      </>
  );
}