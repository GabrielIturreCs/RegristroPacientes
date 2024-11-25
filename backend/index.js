// Cargar dependencias
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno desde .env

// Crear servidor Express
const appExpress = express();
const port = process.env.PORT || 3000; // Puerto definido en .env o por defecto 3000

// Middleware
appExpress.use(bodyParser.json());
appExpress.use(cors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : '*', // Permitir múltiples orígenes desde .env o permitir todos
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost', // Host desde .env o localhost como fallback
    user: process.env.MYSQL_USER || 'root', // Usuario desde .env o root como fallback
    password: process.env.MYSQL_PASSWORD || '', // Contraseña desde .env o cadena vacía como fallback
    database: process.env.MYSQL_DATABASE || 'railway', // Base de datos desde .env o railway como fallback
    port: process.env.MYSQL_PORT || 3306 // Puerto desde .env o 3306 como fallback
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Terminar la ejecución si no se puede conectar a la base de datos
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Iniciar el servidor Express
appExpress.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
});

// Endpoint para registrar un usuario
appExpress.post('/register-user', async (req, res) => {
    try {
        const { name, phone, service, amount, location } = req.body;

        // Validaciones de campos
        if (!name || !phone || !service || !amount || !location) {
            return res.status(400).json({ success: false, message: 'Por favor, ingrese todos los campos obligatorios.' });
        }

        // Formatear la fecha al formato correcto (YYYY-MM-DD HH:MM:SS)
        const registrationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Consulta SQL para insertar el usuario en la base de datos
        const query = 'INSERT INTO users (name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [name, phone, service, amount, location, registrationDate], (err, result) => {
            if (err) {
                console.error('Error al insertar usuario:', err.message);
                return res.status(500).json({ success: false, message: 'Error al registrar el usuario.', errorDetails: err.message });
            }

            console.log('Usuario registrado:', { name, phone, service, amount, location, registrationDate });
            res.json({ success: true, message: 'Usuario registrado con éxito.', user: { name, phone, service, amount, location, registrationDate } });
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario.', errorDetails: error.message });
    }
});

// Endpoint para realizar un registro manual desde el backend
appExpress.post('/manual-register', (req, res) => {
    try {
        // Datos manuales
        const userData = {
            name: "Juan Pérez",
            phone: "123456789",
            service: "Servicio A",
            amount: 100,
            location: "Ciudad X",
            registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' ') // Formato correcto
        };

        // Consulta SQL para insertar el usuario en la base de datos
        const query = 'INSERT INTO users (name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?)';

        // Ejecutar la consulta
        db.query(query, [userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err, result) => {
            if (err) {
                console.error('Error al insertar usuario manualmente:', err.message);
                return res.status(500).json({ success: false, message: 'Error al registrar el usuario.', errorDetails: err.message });
            }

            console.log('Usuario registrado manualmente:', userData);
            res.json({ success: true, message: 'Usuario registrado con éxito.', user: userData });
        });
    } catch (error) {
        console.error('Error al registrar usuario manualmente:', error.message);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario manualmente.', errorDetails: error.message });
    }
});