appExpress.post('/register-user', (req, res) => {

  
  const { name, email, phone } = req.body;

  // Validaciones de campos
  if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Por favor, ingrese todos los campos: nombre, email y teléfono.' });
  }

  // SQL para insertar el usuario en la base de datos
  const sql = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';

  // Ejecutar la consulta
  connection.query(sql, [name, email, phone], (err, result) => {
      if (err) {
          console.error('Error al registrar el usuario:', err);
          return res.status(500).json({ success: false, message: 'Error al registrar el usuario.' });
      }

      console.log('Usuario registrado:', { id: result.insertId, name, email, phone });

      // Responder con un mensaje de éxito
      res.json({ success: true, message: 'Usuario registrado con éxito.', user: { id: result.insertId, name, email, phone } });
  });
});