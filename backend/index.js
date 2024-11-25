const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');  // Asegurando que CORS esté habilitado

// Crear servidor Express
const appExpress = express();
const port = process.env.PORT || 3000;  // Usar variable de entorno para puerto actualizo

// Habilitar el uso de JSON
appExpress.use(bodyParser.json());

// Configuración de CORS para permitir solicitudes desde Netlify y localhost
appExpress.use(cors({
    origin: ['http://localhost:8087', 'https://registrofacil.netlify.app'],  // Permitir solicitudes desde ambos orígenes
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'haproxy',  // HAProxy como host (o 'haproxy' por defecto)
    user: process.env.MYSQL_USER || 'root',  // Usuario de la base de datos
    password: process.env.MYSQL_PASSWORD || 'jvBTVHRKFIztEBnOKYEBYXZGZAGwLLhW',  // Contraseña de la base de datos
    database: process.env.MYSQL_DATABASE || 'railway',  // Nombre de la base de datos
    port: process.env.MYSQL_PORT || 3306,  // Puerto de la base de datos (configurado en HAProxy)
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
        // Datos manuales con un ID fijo (puedes usar un generador único si lo prefieres)
        const userData = {
            id: Math.floor(Math.random() * 10000),  // Generar un ID único aleatorio
            name: "Carlos Ramírez",
            phone: "987654321",
            service: "Servicio B",
            amount: 200,
            location: "Ciudad Y",
            registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' ')  // Formato correcto
        };

        // Consulta SQL para insertar el usuario en la base de datos
        const query = 'INSERT INTO users (id, name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?)';

        // Ejecutar la consulta
        db.query(query, [userData.id, userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err, result) => {
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



// Endpoint para realizar un nuevo registro manual desde el backend
appExpress.post('/new-manual-register', (req, res) => {
    try {
        // Datos manuales con un ID fijo (puedes usar un generador único si lo prefieres)
        const userData = {
            id: Math.floor(Math.random() * 10000),  // Generar un ID único aleatorio
            name: "Carlos Ramírez",
            phone: "987654321",
            service: "Servicio B",
            amount: 200,
            location: "Ciudad Y",
            registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' ')  // Formato correcto
        };

        // Consulta SQL para insertar el usuario en la base de datos
        const query = 'INSERT INTO users (id, name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?)';

        // Ejecutar la consulta
        db.query(query, [userData.id, userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err, result) => {
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