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
    origin: 'http://localhost:5173', // Asegúrate de poner aquí tu puerto de React
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

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:5173");
});
