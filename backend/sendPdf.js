const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Configuración del token y URL de la API de WhatsApp Business
const whatsappApiUrl = 'https://graph.facebook.com/v20.0/381776788358903/messages';
const token = 'EAA1rGJKLfXIBO2lMZAB816ieEGSxEdANoEN56Ruf3w6FDZCpKscEgwCtBD6HsQxI4cDuw4LruXeMnAi04PoZAYZCroOfxamPl5E6JTOl9XpmMmJZBndZAaMB28wVn5sNzaIfkJkb8nSPjJ6DEL5OpTZAVvwwMaZCmZB9qZCuZBz1Omkf4mIavhty0U5G8pP9XbUirGV';

async function sendPdf(phoneNumber, pdfPath) {
    try {
        // Leer el archivo PDF
        const pdfData = fs.readFileSync(pdfPath);

        // Crear un FormData para enviar el archivo
        const formData = new FormData();
        formData.append('file', pdfData, {
            filename: 'factura.pdf',
            contentType: 'application/pdf'
        });

        // Crear el cuerpo del mensaje
        const messageData = {
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'document',
            document: {
                link: 'https://example.com/factura.pdf', // Aquí puedes poner un link al PDF si está alojado en un servidor
                caption: 'Aquí está el archivo PDF solicitado'
            }
        };

        // Enviar el PDF usando la API de WhatsApp Business
        const response = await axios.post(whatsappApiUrl, messageData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('PDF enviado exitosamente', response.data);
    } catch (error) {
        console.error('Error al enviar el PDF:', error.response ? error.response.data : error.message);
    }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const phoneNumber = args.find(arg => arg.startsWith('--phone=')).split('=')[1];
const pdfPath = args.find(arg => arg.startsWith('--file=')).split('=')[1];

sendPdf(phoneNumber, pdfPath);