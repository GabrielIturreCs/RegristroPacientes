const axios = require('axios');

// Función para enviar el formulario
function submitForm() {
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        amount: document.getElementById('amount').value,
        location: document.getElementById('location').value
    };

    // Enviar los datos al backend para generar la factura
    axios.post('http://localhost:3000/generate-pdf', formData) // Cambié localhost por el puerto correcto
        .then(response => {
            // Verifica la respuesta
            console.log('Respuesta del backend:', response.data);

            if (response.data.success) {
                // Muestra un mensaje de éxito
                alert('Factura generada con éxito');

                // Redirige inmediatamente al formulario
                window.location.replace('formulario.html');  // Usamos replace para evitar que el usuario regrese a esta página
            } else {
                // Si hubo un error en la generación
                alert('Error al generar la factura: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('Error al generar la factura:', error);
            alert('Hubo un error al procesar la solicitud.');
        });
}