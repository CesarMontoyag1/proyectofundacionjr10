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


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
