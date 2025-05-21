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
app.post('/eliminarEstudiante', (req, res) => {
    console.log('🗑️ [eliminarEstudiante] req.body:', req.body);
    const { numDoc, tipoDoc, modalidad, dias } = req.body;

    if (!numDoc || !tipoDoc || !modalidad || !dias) {
        console.log('🔴 [eliminarEstudiante] Faltan datos requeridos');
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const query = `
        UPDATE estudiantes
        SET activo = 0
        WHERE numDoc=? AND tipoDoc=? AND modalidad=? AND dias=? AND activo=1
    `;
    const params = [numDoc, tipoDoc, modalidad, dias];

    console.log('🔵 [eliminarEstudiante] Ejecutando UPDATE SOFT-DELETE con params:', params);
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('🔴 [eliminarEstudiante] Error en consulta MySQL:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        console.log('🟢 [eliminarEstudiante] results:', results);
        if (results.affectedRows === 0) {
            console.log('⚪ [eliminarEstudiante] No se actualizó ningún registro');
            return res.status(404).json({ success: false, message: 'Estudiante no encontrado o ya inactivo' });
        }
        res.json({ success: true, message: 'Estudiante desactivado exitosamente' });
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
