const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Asegurando que CORS esté habilitado

// Crear servidor Express
const appExpress = express();
const port = process.env.PORT || 8080; // Usar puerto 8080 para producción en Railway

// Middleware para procesar JSON
appExpress.use(bodyParser.json());

// Configuración de CORS para permitir solicitudes desde Netlify y localhost
appExpress.use(cors({
    origin: ['http://localhost:8087', 'https://registrofacil.netlify.app'], // Permitir solicitudes desde ambos orígenes
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configuración de la conexión a la base de datos
const db = mysql.createPool({
    host: process.env.MYSQL_HOST || 'haproxy',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'jvBTVHRKFIztEBnOKYEBYXZGZAGwLLhW',
    database: process.env.MYSQL_DATABASE || 'railway',
    port: process.env.MYSQL_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión a la base de datos
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos MySQL');
        connection.release(); // Liberar la conexión del pool
    }
});

// Iniciar el servidor Express
appExpress.listen(port, () => {
    console.log(`Backend corriendo en http://localhost:${port}`);
});

// Función para generar un ID único aleatorio
const generateId = () => Math.floor(Math.random() * 10000);

// Endpoint para registrar un usuario
appExpress.post('/register-user', (req, res) => {
    const { name = "", phone = "", service = "", amount = 0, location = "" } = req.body;
    const userData = {
        id: generateId(),
        name,
        phone,
        service,
        amount,
        location,
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const query = 'INSERT INTO users (id, name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [userData.id, userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err) => {
        if (err) {
            console.error('Error al insertar usuario:', err);
            return res.status(500).json({ success: false, message: 'Error al registrar el usuario.', errorDetails: err.message });
        }
        console.log('Usuario registrado:', userData);
        res.json({ success: true, message: 'Usuario registrado con éxito.', user: userData });
    });
});

// Endpoint para obtener la lista de usuarios
appExpress.get('/get-users', (req, res) => {
    const query = 'SELECT * FROM users'; // Consulta para obtener todos los usuarios

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los usuarios:', err);
            return res.status(500).json({ success: false, message: 'Error al obtener los usuarios.', errorDetails: err.message });
        }
        console.log('Usuarios obtenidos:', results); // Agregado para depuración
        res.json({ success: true, users: results });
    });
});

// Endpoint para registrar un usuario manualmente
appExpress.post('/manual-register', (req, res) => {
    const userData = {
        name: "Juan Pérez",
        phone: "123456789",
        service: "Servicio A",
        amount: 100,
        location: "Ciudad X",
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const query = 'INSERT INTO users (name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err) => {
        if (err) {
            console.error('Error al insertar usuario manualmente:', err);
            return res.status(500).json({ success: false, message: 'Error al registrar el usuario manualmente.', errorDetails: err.message });
        }
        console.log('Usuario registrado manualmente:', userData);
        res.json({ success: true, message: 'Usuario registrado con éxito.', user: userData });
    });
});

// Endpoint para registrar otro usuario manualmente desde el backend
appExpress.post('/new-manual-register', (req, res) => {
    const userData = {
        id: generateId(),
        name: "Carlos Ramírez",
        phone: "987654321",
        service: "Servicio B",
        amount: 200,
        location: "Ciudad Y",
        registrationDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const query = 'INSERT INTO users (id, name, phone, service, amount, location, registrationDate) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [userData.id, userData.name, userData.phone, userData.service, userData.amount, userData.location, userData.registrationDate], (err) => {
        if (err) {
            console.error('Error al insertar usuario manualmente:', err);
            return res.status(500).json({ success: false, message: 'Error al registrar el usuario manualmente.', errorDetails: err.message });
        }
        console.log('Usuario registrado manualmente:', userData);
        res.json({ success: true, message: 'Usuario registrado con éxito.', user: userData });
    });
});