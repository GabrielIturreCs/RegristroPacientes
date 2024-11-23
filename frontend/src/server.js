const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Servir archivos PDF desde la carpeta "pdfs"
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.get('/', (req, res) => {
    res.send('Servidor de PDFs está funcionando.');
});

app.listen(port, () => {
    console.log(`Servidor de archivos PDF en ejecución en http://localhost:${port}/pdfs`);
});