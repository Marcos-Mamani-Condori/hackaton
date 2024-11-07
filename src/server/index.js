const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const registerSockets = require('./sockets/socketchat');
const registerLikes = require('./sockets/socketlike');
const imageUploadRouter = require('./routes/imageUpload');
const { router: connectedUsersRouter, handleusers } = require('./routes/connectedUsers');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use('/api', imageUploadRouter);
    server.use('/api/connected-users', connectedUsersRouter); 

    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

    // Manejar la conexión de usuarios y emitir el conteo
    io.on('connection', (socket) => {
        handleusers(socket, io); // Manejar eventos de conexión de usuarios
        registerSockets(socket, io);
        registerLikes(socket, io);
    });

    // Manejar todas las demás rutas con Next.js
    server.all('*', (req, res) => handle(req, res));

    // Iniciar el servidor en el puerto 3000
    httpServer.listen(3000, (err) => {
        if (err) throw err;
        console.log('Servidor listo en http://localhost:3000');
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});