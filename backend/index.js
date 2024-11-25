// Cargar dependencias
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// Definir las variables de entorno directamente en index.js
const processEnv = {
    PORT: 3000,
    CORS_ORIGINS: 'http://localhost:3000,https://miapp.com',
    MYSQL_URL: 'mysql://root:scooYatZFrYswivvuLCgGojmysSMsfck@autorack.proxy.rlwy.net:29457/railway',
};

// Crear servidor Express
const appExpress = express();
const port = processEnv.PORT || 3000; // Puerto definido en processEnv o por defecto 3000

// Middleware
appExpress.use(bodyParser.json());
appExpress.use(cors({
    origin: processEnv.CORS_ORIGINS ? processEnv.CORS_ORIGINS.split(',') : '*', // Permitir múltiples orígenes desde processEnv o permitir todos
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Obtener la URL de la base de datos desde las variables de entorno
const dbUrl = processEnv.MYSQL_URL || 'mysql://root:scooYatZFrYswivvuLCgGojmysSMsfck@autorack.proxy.rlwy.net:29457/railway';

// Crear conexión a la base de datos MySQL utilizando la URL
const db = mysql.createConnection(dbUrl);

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