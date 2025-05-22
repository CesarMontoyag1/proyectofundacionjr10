import React, { useState, useEffect } from 'react';
import styles from '../styles/AnalisisDiseo.module.css'; // Reutilizamos el mismo archivo CSS
import NavBarWithButtons from '../components/NavBarWithButtons'; // Tu barra de navegación
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function AnalisisporInsti() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [institution, setInstitution] = useState(''); // Estado para la institución seleccionada
    const [institutionsList, setInstitutionsList] = useState([]); // Nuevo estado para la lista de instituciones
    const [loadingInstitutions, setLoadingInstitutions] = useState(true); // Estado de carga para instituciones
    const [results, setResults] = useState([]);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    // useEffect para cargar la lista de instituciones al montar el componente
    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await fetch('http://localhost:3000/obtenerInstituciones');
                if (!response.ok) {
                    throw new Error('Error al obtener la lista de instituciones');
                }
                const data = await response.json();
                setInstitutionsList(data);
                setLoadingInstitutions(false);
            } catch (error) {
                console.error('Error fetching institutions:', error);
                // Aquí podrías mostrar un mensaje de error al usuario
                setLoadingInstitutions(false);
            }
        };

        fetchInstitutions();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    const fetchAttendanceData = async () => {
        setLoading(true);
        setAnalysis('');
        setResults([]);

        // Validación básica: asegúrate de que se haya seleccionado una institución
        if (!institution) {
            setAnalysis('Por favor, selecciona una institución para realizar el análisis.');
            setLoading(false);
            return;
        }

        try {
            // Paso 1: Obtener los datos de asistencia de tu backend, incluyendo la institución
            // ¡IMPORTANTE! Aquí llamamos al endpoint específico para instituciones
            const response = await fetch('http://localhost:3000/obtenerAsistenciasPorModalidadInsti', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fechaInicio: startDate, fechaFin: endDate, institucion: institution }), // Enviamos la institución
            });

            if (!response.ok) {
                // Captura el mensaje de error del backend si existe
                const errorBody = await response.text();
                console.error('Error response from backend for attendance data:', errorBody);
                throw new Error(`Error al obtener datos de asistencia de la base de datos. Por favor, inténtalo de nuevo. Detalles: ${errorBody}`);
            }

            const data = await response.json();
            const formattedData = data.map(item => ({
                ...item,
                porcentaje: parseFloat(item.porcentaje)
            }));
            setResults(formattedData);

            // Paso 2: Enviar los datos de asistencia al endpoint de análisis por institución
            const geminiAnalysisResponse = await fetch('http://localhost:3000/analyzeInstitutionAttendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceData: formattedData, institucion: institution }), // Enviamos la institución
            });

            if (!geminiAnalysisResponse.ok) {
                const errorText = await geminiAnalysisResponse.text();
                console.error('Error en la respuesta del backend para el análisis por institución:', geminiAnalysisResponse.status, errorText);
                throw new Error(`Error al analizar datos para la institución: ${geminiAnalysisResponse.statusText}. Detalles: ${errorText}`);
            }

            const analysisData = await geminiAnalysisResponse.json();
            setAnalysis(analysisData.analysis || 'No se generaron sugerencias de análisis para esta institución.');

        } catch (error) {
            console.error('Error en la operación de análisis por institución:', error);
            setAnalysis(`Error: ${error.message}.`);
        } finally {
            setLoading(false);
        }
    };

    // Función para renderizar el contenido del análisis de forma estructurada
    const renderAnalysisContent = (text) => {
        if (!text) return null;

        const lines = text.split('\n').filter(line => line.trim() !== '');
        const elements = [];
        let currentList = null;

        lines.forEach((line, index) => {
            line = line.trim();

            // Modificaciones para el nuevo formato de prompt:
            // Detectar la línea inicial de resumen de la institución
            if (line.includes('En la institución') && line.includes('predomina con un total del')) {
                elements.push(<p key={index} className={styles.analysisParagraph}><strong className={styles.institutionSummary}>{line}</strong></p>);
            } else if (line.startsWith('A continuación, se presenta el porcentaje de asistencia de cada modalidad en esta institución:')) {
                elements.push(<p key={index} className={styles.analysisParagraph}>{line}</p>);
            } else if (line.startsWith('- Modalidad')) {
                elements.push(<li key={index} className={styles.resultsListItem}>{line.replace('- Modalidad ', 'Modalidad ')}</li>);
            }
            // Encabezados de sugerencias
            else if (line.startsWith('Basado en estos datos, identifica las modalidades con bajo porcentaje de asistencia')) {
                elements.push(<p key={index} className={styles.analysisParagraph}>{line}</p>);
            }
            else if (line.startsWith('**Sugerencias para mejorar la asistencia en')) {
                elements.push(<h3 key={index} className={styles.analysisSubHeading}>{line.replace(/\*\*/g, '')}</h3>);
                currentList = null;
            }
            // Listas numeradas (sugerencias principales)
            else if (/^\d+\.\s+\*\*(.+?)\*\*:/.test(line)) {
                if (currentList && currentList.type === 'ul') {
                    elements.push(currentList.jsx);
                    currentList = null;
                }
                const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*: (.+)/);
                if (match) {
                    elements.push(
                        <li key={index} className={styles.mainSuggestion}>
                            <strong>{match[1]}</strong>: {match[2]}
                        </li>
                    );
                } else {
                    elements.push(<li key={index} className={styles.mainSuggestion}>{line}</li>);
                }
                if (!elements[elements.length - 1].parentElement || elements[elements.length - 1].parentElement.tagName !== 'OL') {
                    if (elements.length > 0 && elements[elements.length - 1].type === 'li' && elements[elements.length - 1].props.className === styles.mainSuggestion) {
                        const lastLi = elements.pop();
                        elements.push(<ol key={`ol-${index}`} className={styles.mainSuggestionsList}>{lastLi}</ol>);
                    } else {
                        elements.push(<ol key={`ol-${index}`} className={styles.mainSuggestionsList}><li key={index} className={styles.mainSuggestion}>{line}</li></ol>);
                    }
                }
                currentList = { type: 'ol', jsx: elements[elements.length - 1] };
            }
            // Listas con viñetas (sub-sugerencias)
            else if (line.startsWith('* **Sugerencia')) {
                const match = line.match(/^\*\s+\*\*(.+?)\*\*: (.+)/);
                if (match) {
                    const subSuggestionText = match[2].replace(/\(|\)/g, '');
                    if (!currentList || currentList.type !== 'ul') {
                        currentList = { type: 'ul', jsx: <ul key={`ul-${index}`} className={styles.subSuggestionsList}></ul> };
                        elements.push(currentList.jsx);
                    }
                    currentList.jsx.props.children = [...(currentList.jsx.props.children || []),
                        <li key={index}>
                            <strong>{match[1]}</strong>: {subSuggestionText}
                        </li>
                    ];
                }
            }
            // Párrafos o texto general
            else {
                if (currentList) {
                    elements.push(currentList.jsx);
                    currentList = null;
                }
                elements.push(<p key={index} className={styles.analysisParagraph}>{line}</p>);
            }
        });

        if (currentList) {
            elements.push(currentList.jsx);
        }

        return elements;
    };

    return (
        <div className={styles.globalContainer}>
            <NavBarWithButtons />
            <div className={styles.mainContentContainer}>
                <div className={styles.analysisSection}>
                    <h1 className={styles.title}>Análisis de Asistencias por Institución</h1>
                    <p className={styles.introText}>
                        Esta sección te permite analizar las asistencias de los niños a las diferentes modalidades, filtrando específicamente por una institución educativa. Obtén un diagnóstico detallado y sugerencias personalizadas para mejorar la participación en ese colegio.
                    </p>
                    <div className={styles.form}>
                        <label className={styles.label}>
                            Fecha de inicio:
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.label}>
                            Fecha de fin:
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={styles.input}
                            />
                        </label>
                        <label className={styles.label}>
                            Institución:
                            {loadingInstitutions ? (
                                <p className={styles.loadingText}>Cargando instituciones...</p>
                            ) : (
                                <select
                                    value={institution}
                                    onChange={(e) => setInstitution(e.target.value)}
                                    className={styles.input} // Reutilizamos el estilo del input
                                >
                                    <option value="">Selecciona una institución</option>
                                    {institutionsList.map((inst, index) => (
                                        <option key={index} value={inst.nombre}>
                                            {inst.nombre}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </label>
                        <button onClick={fetchAttendanceData} className={styles.button} disabled={loading || loadingInstitutions}>
                            {loading ? 'Analizando...' : 'Analizar'}
                        </button>
                    </div>

                    <div className={styles.results}>
                        <h2>Resultados de Asistencia por Modalidad</h2>
                        {results.length > 0 ? (
                            <ul className={styles.resultsList}>
                                {results.map((result) => (
                                    <li key={result.modalidad} className={styles.resultsListItem}>
                                        Modalidad {result.modalidad}: {result.porcentaje}% de asistencia
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.placeholderText}>Selecciona un rango de fechas y una institución para ver los resultados.</p>
                        )}
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.graphSection}>
                        <h2>Gráfica de Asistencia por Modalidad</h2>
                        {loading ? (
                            <p className={styles.loadingText}>Cargando gráfica...</p>
                        ) : results.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={results}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="modalidad" stroke="#333" />
                                    <YAxis stroke="#333" label={{ value: 'Porcentaje de Asistencia (%)', angle: -90, position: 'insideLeft', fill: '#333' }} />
                                    <Tooltip
                                        formatter={(value) => `${value}%`}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #ccc',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                        }}
                                        labelStyle={{ color: '#555', fontWeight: 'bold' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                    <Bar dataKey="porcentaje" fill="#3b82f6" name="Asistencia" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className={styles.graphPlaceholder}>
                                <p>La gráfica se mostrará aquí una vez que se analicen los datos.</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.analysisOutputContainer}>
                        <h2>Análisis y Sugerencias de Gemini</h2>
                        {loading && <p className={styles.loadingText}>Generando análisis...</p>}
                        {!loading && analysis && (
                            <div className={styles.analysisContent}>
                                {renderAnalysisContent(analysis)}
                            </div>
                        )}
                        {!loading && !analysis && results.length > 0 && <p className={styles.placeholderText}>No se pudo generar un análisis. Inténtalo de nuevo.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
