import React, { useState } from 'react';
import styles from '../styles/AnalisisDiseo.module.css';
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

export default function AnalisisGeneral() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [results, setResults] = useState([]);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchAttendanceData = async () => {
        setLoading(true);
        setAnalysis('');
        setResults([]);

        try {
            const response = await fetch('http://localhost:3000/obtenerAsistenciasPorModalidad', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fechaInicio: startDate, fechaFin: endDate }),
            });

            if (!response.ok) {
                throw new Error('Error al obtener datos de asistencia de la base de datos');
            }

            const data = await response.json();
            const formattedData = data.map(item => ({
                ...item,
                porcentaje: parseFloat(item.porcentaje)
            }));
            setResults(formattedData);

            const geminiAnalysisResponse = await fetch('http://localhost:3000/analyzeAttendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendanceData: formattedData }),
            });

            if (!geminiAnalysisResponse.ok) {
                const errorText = await geminiAnalysisResponse.text();
                console.error('Error en la respuesta del backend para el análisis:', geminiAnalysisResponse.status, errorText);
                throw new Error(`Error al analizar datos: ${geminiAnalysisResponse.statusText}`);
            }

            const analysisData = await geminiAnalysisResponse.json();
            setAnalysis(analysisData.analysis || 'No se generaron sugerencias de análisis.');

        } catch (error) {
            console.error('Error en la operación de análisis:', error);
            setAnalysis(`Error: ${error.message}. Por favor, inténtalo de nuevo.`);
        } finally {
            setLoading(false);
        }
    };

    const renderAnalysisContent = (text) => {
        if (!text) return null;

        const lines = text.split('\n').filter(line => line.trim() !== '');
        const elements = [];
        let currentList = null;

        lines.forEach((line, index) => {
            line = line.trim();

            if (line.startsWith('**Las 3 modalidades con mejor asistencia son:**')) {
                elements.push(<h3 key={index} className={styles.analysisHeading}>{line.replace(/\*\*/g, '')}</h3>);
                currentList = null;
            } else if (line.startsWith('**Modalidad con bajo porcentaje de asistencia:')) {
                elements.push(<h3 key={index} className={styles.analysisHeading}>{line.replace(/\*\*/g, '')}</h3>);
                currentList = null;
            } else if (line.startsWith('**Sugerencias para mejorar la asistencia en')) {
                elements.push(<h3 key={index} className={styles.analysisSubHeading}>{line.replace(/\*\*/g, '')}</h3>);
                currentList = null;
            }
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
        <div className={styles.globalContainer}> {/* Nuevo contenedor global */}
            <NavBarWithButtons /> {/* Tu barra de navegación */}
            <div className={styles.mainContentContainer}> {/* Contenedor para el resto del contenido */}
                <div className={styles.analysisSection}>
                    <h1 className={styles.title}>Análisis General de Asistencias</h1>
                    <p className={styles.introText}>
                        Esta sección visualiza y analiza las asistencias de los niños en diferentes modalidades. Genera un diagnóstico detallado, identificando modalidades populares y ofreciendo sugerencias personalizadas para mejorar la participación.
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
                        <button onClick={fetchAttendanceData} className={styles.button} disabled={loading}>
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
                            <p className={styles.placeholderText}>Selecciona un rango de fechas y haz clic en "Analizar" para ver los resultados.</p>
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
