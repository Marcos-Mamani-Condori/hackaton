'use server'
const sendMessageBot = (message) => {
    console.log('Enviando mensaje al bot:', message); 
    return fetch('http://192.168.137.33:5000/message', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }), 
    })
        .then(response => {
            console.log('Estado de la respuesta:', response.status); 
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor'); 
            }
            return response.json(); 
        })
        .then(data => {
            console.log('Respuesta del bot:', data.response); 
            return data.response; 
        })
        .catch(error => {
            console.error('Error:', error); 
        });
};

export { sendMessageBot };
