const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');  // Asegurando que CORS esté habilitado

// Crear servidor Express
const appExpress = express();
const port = process.env.PORT || 3000;  // Usar variable de entorno para puerto

// Habilitar el uso de JSON
appExpress.use(bodyParser.json());

// Configuración de CORS para permitir solicitudes desde Netlify y localhost
appExpress.use(cors({
    origin: ['http://localhost:8085', 'https://registrofacil.netlify.app'],  // Permitir solicitudes desde ambos orígenes
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'mysql.railway.internal',  // Usar la variable de entorno MYSQL_HOST
    user: process.env.MYSQL_USER || 'root',  // Usuario de la base de datos
    password: process.env.MYSQL_PASSWORD || 'jvBTVHRKFIztEBnOKYEBYXZGZAGwLLhW',  // Contraseña de la base de datos
    database: process.env.MYSQL_DATABASE || 'railway',  // Base de datos a utilizar
    port: process.env.MYSQL_PORT || 3306  // Puerto de la base de datos (por defecto 3306)
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
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

        // Estructura de los datos del usuario
        const userData = {
            name,
            phone,
            service,
            amount,
            location,
            registrationDate
        };

        // Consulta SQL para insertar el usuario en la base de datos
        const query = 'INSERT INTO users (name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err, result) => {
            if (err) {
                console.error('Error al insertar usuario:', err);
                return res.status(500).json({ success: false, message: 'Error al registrar el usuario.', errorDetails: err.message });
            }

            console.log('Usuario registrado:', userData);

            // Responder con un mensaje de éxito
            res.json({ success: true, message: 'Usuario registrado con éxito.', user: userData });
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
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
            registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' ')  // Formato correcto
        };

        // Consulta SQL para insertar el usuario en la base de datos
        const query = 'INSERT INTO users (name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?)';

        // Ejecutar la consulta
        db.query(query, [userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err, result) => {
            if (err) {
                console.error('Error al insertar usuario manualmente:', err);
                return res.status(500).json({ success: false, message: 'Error al registrar el usuario.', errorDetails: err.message });
            }

            console.log('Usuario registrado manualmente:', userData);
            res.json({ success: true, message: 'Usuario registrado con éxito.', user: userData });
        });
    } catch (error) {
        console.error('Error al registrar usuario manualmente:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario manualmente.', errorDetails: error.message });
    }
});