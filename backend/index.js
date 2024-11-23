const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Crear servidor Express
const appExpress = express();
const port = process.env.PORT || 3000; // Usar variable de entorno para puerto

// Habilitar el uso de JSON
appExpress.use(bodyParser.json());

// Configuración de conexión a MySQL
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'mysql-master', // Usar la variable de entorno MYSQL_HOST
    user: process.env.MYSQL_USER || 'root',  // Usuario de la base de datos
    password: process.env.MYSQL_PASSWORD || 'root',  // Contraseña de la base de datos
    database: process.env.MYSQL_DATABASE || 'usersdb'  // Base de datos a utilizar
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
        const { name, email, phone } = req.body;

        // Validaciones de campos
        if (!name || !email || !phone) {
            return res.status(400).json({ success: false, message: 'Por favor, ingrese todos los campos: nombre, email y teléfono.' });
        }

        // Estructura de los datos del usuario
        const userData = {
            name,
            email,
            phone,
            registrationDate: new Date().toISOString()
        };

        // Consulta SQL para insertar el usuario en la base de datos
        const query = 'INSERT INTO users (name, email, phone, registrationDate) VALUES (?, ?, ?, ?)';
        db.query(query, [userData.name, userData.email, userData.phone, userData.registrationDate], (err, result) => {
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