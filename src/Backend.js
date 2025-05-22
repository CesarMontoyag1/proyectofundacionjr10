import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Permitir CORS desde React (por ejemplo, en http://localhost:5173)
app.use(cors({
    origin: 'http://localhost:5175',
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Marien_06',
    database: 'basedatosfundacion',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Ruta de login
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    const query = `
        SELECT * FROM Usuario
        WHERE (username = ? OR email = ?) AND password = ?
    `;

    db.query(query, [usuario, usuario, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }

        if (results.length > 0) {
            const user = results[0];
            return res.json({
                success: true,
                rol: user.rol
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
    });
});

app.get('/obtenerInstituciones', (req, res) => {
    const sql = `
        SELECT DISTINCT InstitucionEducativa AS nombre
        FROM estudiantes
        WHERE InstitucionEducativa IS NOT NULL AND InstitucionEducativa != ''
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener instituciones:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        res.json(results); // [{ nombre: 'IE X' }, { nombre: 'IE Y' }, ...]
    });
});

app.post('/obtenerEstudiantesPorInstitucion', (req, res) => {
    const { institucion, modalidad, dias } = req.body;

    const sql = `
        SELECT numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido, modalidad, dias
        FROM estudiantes
        WHERE InstitucionEducativa = ? AND modalidad = ? AND dias = ?
    `;

    db.query(sql, [institucion, modalidad, dias], (err, results) => {
        if (err) {
            console.error('Error al obtener estudiantes:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        res.json(results);
    });
});
// Ruta para registrar asistencia
app.post('/registrarAsistencia', (req, res) => {
    const { fecha, asistencias } = req.body;

    if (!fecha || !Array.isArray(asistencias) || asistencias.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const sqlAsistencia = `
        INSERT INTO asistencia (fechaAsistencia, Usuario_numDoc, Usuario_tipoDoc)
        VALUES (?, ?, ?)
    `;
    const asistenciaValues = [fecha, "123456789", "CC"]; // Ajusta los valores de Usuario según corresponda

    db.query(sqlAsistencia, asistenciaValues, (err, result) => {
        if (err) {
            console.error('Error al guardar asistencia principal:', err);
            return res.status(500).json({ error: 'Error al guardar la asistencia principal' });
        }

        const idAsistencia = result.insertId;

        // Obtener automáticamente la institución desde la tabla estudiantes
        const valoresHasEstudiante = asistencias.map(item => [
            idAsistencia,
            item.numDoc,
            item.tipoDoc,
            item.modalidad,
            item.dias,
            item.asistio ? 1 : 0
        ]);

        const sqlHasEstudiante = `
            INSERT INTO asistencia_has_estudiantes
            (asistencia_idAsistencia, estudiantes_numDoc, estudiantes_tipoDoc, estudiantes_modalidad, estudiantes_dias, asistio)
            VALUES ?
        `;

        db.query(sqlHasEstudiante, [valoresHasEstudiante], (err2) => {
            if (err2) {
                console.error('Error al guardar asistencia_has_estudiantes:', err2);
                return res.status(500).json({ error: 'Error al guardar los registros de asistencia de estudiantes' });
            }
            res.json({ mensaje: 'Asistencia registrada correctamente' });
        });
    });
});

app.post('/consultarAsistencia', (req, res) => {
    const { fecha, institucion, modalidad, dias } = req.body;

    const sql = `
        SELECT
            e.numDoc,
            e.primerNombre,
            e.segundoNombre,
            e.primerApellido,
            e.segundoApellido,
            e.modalidad,
            e.dias,
            ahe.asistio
        FROM
            asistencia a
                JOIN
            asistencia_has_estudiantes ahe ON a.idAsistencia = ahe.asistencia_idAsistencia
                JOIN
            estudiantes e ON ahe.estudiantes_numDoc = e.numDoc
                AND ahe.estudiantes_tipoDoc = e.tipoDoc
                AND ahe.estudiantes_modalidad = e.modalidad
                AND ahe.estudiantes_dias = e.dias
        WHERE
            a.fechaAsistencia = ?
          AND e.InstitucionEducativa = ?
          AND e.modalidad = ?
          AND e.dias = ?;
    `;

    db.query(sql, [fecha, institucion, modalidad, dias], (err, results) => {
        if (err) {
            console.error('Error al consultar asistencia:', err);
            return res.status(500).json({ error: 'Error al consultar asistencia' });
        }
        res.json(results);
    });
});

app.post('/buscarEstudiante', (req, res) => {
    const { documento } = req.body;

    const estudianteQuery = `
        SELECT * FROM estudiantes
        WHERE numDoc = ?
    `;

    const asistenciaQuery = `
        SELECT
            SUM(CASE WHEN asistio = 1 THEN 1 ELSE 0 END) AS asistencias,
            SUM(CASE WHEN asistio = 0 THEN 1 ELSE 0 END) AS inasistencias
        FROM asistencia_has_estudiantes
        WHERE estudiantes_numDoc = ?
    `;

    db.query(estudianteQuery, [documento], (err, estudianteResults) => {
        if (err) {
            console.error('Error al ejecutar la consulta de estudiante:', err);
            return res.status(500).send('Error interno del servidor');
        }

        if (estudianteResults.length === 0) {
            return res.status(404).send('Estudiante no encontrado');
        }

        db.query(asistenciaQuery, [documento], (err2, asistenciaResults) => {
            if (err2) {
                console.error('Error al ejecutar la consulta de asistencias:', err2);
                return res.status(500).send('Error interno del servidor');
            }

            const estudiante = estudianteResults[0];
            const { asistencias = 0, inasistencias = 0 } = asistenciaResults[0];

            // Ahora sí devolvemos JSON
            res.json({
                estudiante,
                asistencias,
                inasistencias
            });
        });
    });
});

app.post('/agregarEstudiante', (req, res) => {
    const {
        numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor,
    } = req.body;

    console.log('Datos recibidos:', req.body);

    const query = `
        INSERT INTO estudiantes (
            numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
            genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
            paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
            zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
            codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
            sede, grado, jornada, nit, proveedor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor,
    ], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        console.log('Consulta ejecutada con éxito. Resultados:', results);
        res.json({ success: true, message: 'Estudiante agregado exitosamente' });
    });
});

app.post('/agregarUsuario', (req, res) => {
    const {
        nombre, apellidos, tipoDocumento, numeroDocumento, rol, username, password, email
    } = req.body;

    const query = `
        INSERT INTO usuario (
            numDoc, tipoDoc, username, email, password, rol, nombre, apellido
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        numeroDocumento, tipoDocumento, username, email, password, rol, nombre, apellidos
    ], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, message: 'Usuario agregado exitosamente' });
    });
});

/** BUSCAR USUARIO (sólo activos) **/
app.post('/buscarUsuario', (req, res) => {
    console.log('buscarUsuario → body recibido:', req.body);
    const { tipoDocumento, numeroDocumento } = req.body;

    if (!tipoDocumento || !numeroDocumento) {
        return res
            .status(400)
            .json({ success: false, message: 'Faltan datos requeridos' });
    }

    const query = `
        SELECT tipoDoc, numDoc, nombre, apellido, username, email, rol
        FROM usuario
        WHERE tipoDoc = ? AND numDoc = ? AND activo = 1
    `;
    db.query(query, [tipoDocumento, numeroDocumento], (err, results) => {
        if (err) {
            console.error('Error en /buscarUsuario:', err);
            return res
                .status(500)
                .json({ success: false, message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, usuario: results[0] });
    });
});

/** EDITAR USUARIO **/
app.post('/editarUsuario', (req, res) => {
    console.log('editarUsuario → body recibido:', req.body);
    const { numDoc, tipoDoc, nombre, apellido, username, email, rol } = req.body;

    if (!numDoc || !tipoDoc) {
        return res
            .status(400)
            .json({ success: false, message: 'Falta el número/tipo de documento' });
    }

    const query = `
        UPDATE usuario
        SET nombre = ?, apellido = ?, username = ?, email = ?, rol = ?
        WHERE numDoc = ? AND tipoDoc = ? AND activo = 1
    `;
    db.query(
        query,
        [nombre, apellido, username, email, rol, numDoc, tipoDoc],
        (err, results) => {
            if (err) {
                console.error('Error en /editarUsuario:', err);
                return res
                    .status(500)
                    .json({ success: false, message: 'Error interno del servidor' });
            }
            if (results.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: 'Usuario no encontrado o inactivo' });
            }
            res.json({ success: true, message: 'Usuario editado exitosamente' });
        }
    );
});

/** “ELIMINAR” USUARIO → SOFT-DELETE **/
app.post('/eliminarUsuario', (req, res) => {
    console.log('eliminarUsuario → body recibido:', req.body);
    const { numDoc, tipoDoc } = req.body;

    if (!numDoc || !tipoDoc) {
        return res
            .status(400)
            .json({ success: false, message: 'Falta el número/tipo de documento' });
    }

    const query = `
        UPDATE usuario
        SET activo = 0
        WHERE numDoc = ? AND tipoDoc = ? AND activo = 1
    `;
    db.query(query, [numDoc, tipoDoc], (err, results) => {
        if (err) {
            console.error('Error en /eliminarUsuario:', err);
            return res
                .status(500)
                .json({ success: false, message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Usuario no encontrado o ya inactivo' });
        }
        res.json({ success: true, message: 'Usuario desactivado exitosamente' });
    });
});

// server.js (añade debajo de los endpoints de usuario)

//
// BUSCAR ESTUDIANTE (sólo activos)
//
// … tus imports y configuración de Express/MySQL

/** BUSCAR ESTUDIANTE (pidiendo solo tipoDoc y numDoc) **/
app.post('/buscarEstudianteed', (req, res) => {
    console.log('🟢 [buscarEstudiante] req.body:', req.body); // Verifica los datos recibidos
    const { tipoDoc, numDoc } = req.body;

    if (!tipoDoc || !numDoc) {
        console.log('🔴 [buscarEstudiante] Faltan tipoDoc o numDoc');
        return res.status(400).json({ success: false, message: 'Faltan tipoDoc o numDoc' });
    }

    const query = `
        SELECT *
        FROM estudiantes
        WHERE tipoDoc = ? AND numDoc = ? AND activo = 1
            LIMIT 1
    `;
    db.query(query, [tipoDoc, numDoc], (err, results) => {
        if (err) {
            console.error('🔴 [buscarEstudiante] Error en consulta MySQL:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }

        console.log('🟢 [buscarEstudiante] results:', results);
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        }

        res.json({ success: true, estudiante: results[0] });
    });
});
/** EDITAR ESTUDIANTE **/
app.post('/editarEstudiante', (req, res) => {
    console.log('✏️ [editarEstudiante] req.body:', req.body);
    const {
        numDoc, tipoDoc,
        primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, InstitucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor
    } = req.body;

    if (!numDoc || !tipoDoc) {
        console.log('🔴 [editarEstudiante] Faltan numDoc o tipoDoc');
        return res.status(400).json({ success: false, message: 'Faltan numDoc o tipoDoc' });
    }

    const query = `
        UPDATE estudiantes SET
                               primerNombre=?, segundoNombre=?, primerApellido=?, segundoApellido=?,
                               genero=?, fechaNacimiento=?, estadoCivil=?, grupoEtnico=?, factorVulnerabilidad=?,
                               paisNacimiento=?, municipioNacimiento=?, municipioResidencia=?, direccionResidencia=?,
                               zonaEstudiante=?, mundo=?, modalidad=?, dias=?, horarioInicio=?, horarioFin=?,
                               codigoDaneIE=?, subregionIE=?, municipioIE=?, InstitucionEducativa=?, codigoDaneSede=?,
                               sede=?, grado=?, jornada=?, nit=?, proveedor=?
        WHERE numDoc=? AND tipoDoc=? AND modalidad=? AND dias=? AND activo = 1
    `;
    const params = [
        primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimiento||null, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicio||null, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, InstitucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor,
        numDoc, tipoDoc, modalidad, dias
    ];

    console.log('🔵 [editarEstudiante] Ejecutando UPDATE con params:', params);
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('🔴 [editarEstudiante] Error en consulta MySQL:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        console.log('🟢 [editarEstudiante] results:', results);
        if (results.affectedRows === 0) {
            console.log('⚪ [editarEstudiante] No se actualizó ningún registro');
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado o inactivo' });
        }
        res.json({ success: true, message: 'Estudiante editado exitosamente' });
    });
});

/** “ELIMINAR” ESTUDIANTE → SOFT-DELETE **/
// Endpoint para obtener asistencias por modalidad (ya existente)
app.post('/obtenerAsistenciasPorModalidad', (req, res) => {
    const { fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Faltan las fechas de inicio y fin' });
    }

    const query = `
        SELECT
            e.modalidad,
            COUNT(ahe.asistio) AS total,
            SUM(CASE WHEN ahe.asistio = 1 THEN 1 ELSE 0 END) AS asistencias
        FROM
            asistencia a
                JOIN
            asistencia_has_estudiantes ahe ON a.idAsistencia = ahe.asistencia_idAsistencia
                JOIN
            estudiantes e ON ahe.estudiantes_numDoc = e.numDoc
        WHERE
            a.fechaAsistencia BETWEEN ? AND ?
        GROUP BY
            e.modalidad
    `;

    db.query(query, [fechaInicio, fechaFin], (err, results) => {
        if (err) {
            console.error('Error al obtener asistencias:', err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        const data = results.map(row => ({
            modalidad: row.modalidad,
            porcentaje: parseFloat(((row.asistencias / row.total) * 100).toFixed(2)), // Convertir a número
        }));

        res.json(data);
    });
});

// NUEVO Endpoint para analizar datos con la API de Gemini
// Endpoint para analizar datos con la API de Gemini
app.post('/analyzeAttendance', async (req, res) => {
    const { attendanceData } = req.body;

    if (!attendanceData || attendanceData.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron datos de asistencia para analizar.' });
    }

    const prompt = `Analiza los siguientes datos de asistencia a modalidades, donde cada objeto contiene 'modalidad' y 'porcentaje' de asistencia.
    Identifica las 3 modalidades con mejor asistencia y proporciona sugerencias específicas y accionables (al menos 3 por modalidad) para mejorar la asistencia en las modalidades con porcentajes bajos.
    Las sugerencias deben estar enfocadas en cómo los niños pueden mejorar sus asistencias.
    Los datos son: ${JSON.stringify(attendanceData)}.`;

    // ** ¡IMPORTANTE! Reemplaza "TU_CLAVE_API_DE_GEMINI_AQUI" con tu clave API real y válida. **
    // Considera usar variables de entorno (dotenv) para mayor seguridad en un entorno de producción.
    const apiKey = "AIzaSyC8v4TgJqbiI9CRPo7uuDWScCu6I2Z0qT8"; // <--- ¡VERIFICA ESTA CLAVE!

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    console.log('Intentando llamar a la API de Gemini...');
    console.log('URL de la API:', apiUrl);
    console.log('Payload enviado a Gemini:', JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }, null, 2));

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la llamada a la API de Gemini:');
            console.error('Código de estado:', response.status);
            console.error('Mensaje de estado:', response.statusText);
            console.error('Cuerpo de la respuesta de error:', errorText);
            throw new Error(`Error al analizar datos con Gemini: ${response.statusText}. Detalles: ${errorText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const analysisText = result.candidates[0].content.parts[0].text;
            res.json({ analysis: analysisText });
        } else {
            console.warn('Respuesta inesperada de la API de Gemini:', result);
            res.json({ analysis: 'No se pudo generar un análisis detallado.' });
        }

    } catch (error) {
        console.error('Error al procesar la solicitud de análisis:', error);
        res.status(500).json({ error: `Error interno del servidor al analizar datos: ${error.message}` });
    }
});

// NUEVO ENDPOINT: Para obtener asistencias por modalidad FILTRADO POR INSTITUCIÓN
// Este endpoint es llamado por AnalisisporInsti.jsx
app.post('/obtenerAsistenciasPorModalidadInsti', (req, res) => {
    // ¡CORRECCIÓN CLAVE AQUÍ! Asegurarse de que 'institucion' se reciba del body
    const { fechaInicio, fechaFin, institucion } = req.body;

    console.log('[/obtenerAsistenciasPorModalidadInsti] Recibida solicitud con:');
    console.log('  Fecha Inicio:', fechaInicio);
    console.log('  Fecha Fin:', fechaFin);
    console.log('  Institucion:', institucion); // Verifica que esto muestre el valor correcto

    if (!fechaInicio || !fechaFin || !institucion) { // La institución ahora es obligatoria para este endpoint
        return res.status(400).json({ error: 'Faltan las fechas de inicio, fin o la institución.' });
    }

    let query = `
        SELECT
            e.modalidad,
            COUNT(ahe.asistio) AS total,
            SUM(CASE WHEN ahe.asistio = 1 THEN 1 ELSE 0 END) AS asistencias
        FROM
            asistencia a
        JOIN
            asistencia_has_estudiantes ahe ON a.idAsistencia = ahe.asistencia_idAsistencia
        JOIN
            estudiantes e ON ahe.estudiantes_numDoc = e.numDoc
        WHERE
            a.fechaAsistencia BETWEEN ? AND ?
            AND e.InstitucionEducativa = ?
        GROUP BY
            e.modalidad
    `;
    const queryParams = [fechaInicio, fechaFin, institucion];


    console.log('[/obtenerAsistenciasPorModalidadInsti] Consulta SQL a ejecutar:', query);
    console.log('[/obtenerAsistenciasPorModalidadInsti] Parámetros de consulta:', queryParams);

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error al obtener asistencias por institución:', err);
            // Detalles del error de MySQL para depuración
            console.error('Detalles del error MySQL:', err.message || err);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }

        const data = results.map(row => ({
            modalidad: row.modalidad,
            porcentaje: parseFloat(((row.asistencias / row.total) * 100).toFixed(2)),
        }));

        console.log('[/obtenerAsistenciasPorModalidadInsti] Datos obtenidos de la DB:', data);
        res.json(data);
    });
});

// Endpoint para analizar datos de asistencia específicamente por institución
// Este endpoint es llamado por AnalisisporInsti.jsx para el análisis de Gemini
app.post('/analyzeInstitutionAttendance', async (req, res) => {
    const { attendanceData, institucion } = req.body;

    console.log('[/analyzeInstitutionAttendance] Recibida solicitud con:');
    console.log('  Institucion:', institucion);
    console.log('  Attendance Data (recibido del frontend):', attendanceData);


    if (!attendanceData || !institucion) { // attendanceData puede estar vacío si no hay asistencias
        return res.status(400).json({ error: 'Faltan datos de asistencia o el nombre de la institución para analizar.' });
    }

    // Construye el prompt específico para el análisis por institución
    let prompt = `Analiza *exclusivamente* los siguientes datos de asistencia a modalidades para la institución "${institucion}".
    Es *crucial* que solo utilices la información proporcionada a continuación y no infieras o añadas otras modalidades que no estén en la lista.
    Estos son los *únicos* datos de asistencia disponibles para esta institución en el período especificado.\n\n`;

    if (attendanceData.length > 0) {
        const sortedData = [...attendanceData].sort((a, b) => b.porcentaje - a.porcentaje);
        const topModalidad = sortedData[0];

        prompt += `En la institución "${institucion}", se puede observar cómo la modalidad "${topModalidad.modalidad}" predomina con un total del ${topModalidad.porcentaje}% de asistencias.\n\n`;
        prompt += `A continuación, se presenta el porcentaje de asistencia de cada modalidad en esta institución:\n`;
        attendanceData.forEach(item => {
            prompt += `- Modalidad "${item.modalidad}": ${item.porcentaje}% de asistencia.\n`;
        });
        prompt += `\n`;
    } else {
        prompt += `No se encontraron datos de asistencia para la institución "${institucion}" en el rango de fechas seleccionado. Por lo tanto, no se pueden generar sugerencias específicas de mejora para modalidades.\n\n`;
    }

    prompt += `Basado *únicamente* en los datos de asistencia proporcionados, identifica las modalidades con bajo porcentaje de asistencia (por debajo del 70%, si aplica) y proporciona sugerencias específicas y accionables (al menos 3 por modalidad) para mejorar la asistencia de los niños en esas modalidades dentro de la institución "${institucion}". Las sugerencias deben estar enfocadas en acciones que la institución o los padres pueden tomar para motivar a los niños a mejorar sus asistencias. Si no hay modalidades con bajo porcentaje de asistencia en los datos proporcionados, indícalo claramente.`;


    const apiKey = "AIzaSyC8v4TgJqbiI9CRPo7uuDWScCu6I2Z0qT8"; // VERIFICA ESTA CLAVE
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    console.log('Intentando llamar a la API de Gemini para análisis por institución...');
    console.log('URL de la API:', apiUrl);
    console.log('Payload enviado a Gemini:', JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }, null, 2));

    try {
        const payload = {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en la llamada a la API de Gemini para análisis por institución:');
            console.error('Código de estado:', response.status);
            console.error('Mensaje de estado:', response.statusText);
            console.error('Cuerpo de la respuesta de error:', errorText);
            throw new Error(`Error al analizar datos con Gemini para institución: ${response.statusText}. Detalles: ${errorText}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const analysisText = result.candidates[0].content.parts[0].text;
            res.json({ analysis: analysisText });
        } else {
            console.warn('Respuesta inesperada de la API de Gemini para análisis por institución:', result);
            res.json({ analysis: 'No se pudo generar un análisis detallado para la institución.' });
        }

    } catch (error) {
        console.error('Error al procesar la solicitud de análisis por institución:', error);
        res.status(500).json({ error: `Error interno del servidor al analizar datos por institución: ${error.message}` });
    }
});


app.get('/notificaciones', (req, res) => {
    const query = `
        SELECT
            e.numDoc,
            e.primerNombre,
            e.primerApellido,
            COUNT(*) AS inasistencias,
            MAX(ae.leido) AS leido
        FROM asistencia_has_estudiantes ae
                 JOIN asistencia a ON ae.asistencia_idAsistencia = a.idAsistencia
                 JOIN estudiantes e ON ae.estudiantes_numDoc = e.numDoc
            AND ae.estudiantes_tipoDoc = e.tipoDoc
            AND ae.estudiantes_modalidad = e.modalidad
            AND ae.estudiantes_dias = e.dias
        WHERE ae.asistio = 0
        GROUP BY e.numDoc, e.primerNombre, e.primerApellido
        HAVING inasistencias >= 3;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener notificaciones:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        const nuevasNotificaciones = results.some(n => n.leido === 0);
        res.json({ notificaciones: results, nuevas: nuevasNotificaciones });
    });
});

app.post('/notificaciones/leer', (req, res) => {
    const query = `
        UPDATE asistencia_has_estudiantes
        SET leido = 1
        WHERE leido = 0
    `;

    db.query(query, (err) => {
        if (err) {
            console.error('Error al marcar notificaciones como leídas:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json({ ok: true });
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
