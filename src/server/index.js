const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const registerSockets = require('./sockets/socketchat');
const registerLikes = require('./sockets/socketlike');
const imageUploadRouter = require('./routes/imageUpload');
const { router: connectedUsersRouter, handleusers } = require('./routes/connectedUsers');
const audioUploadRouter = require('./routes/audioUpload'); // Importa el router para subir audio
const session = require('express-session');
const { getClient } = require('../libs/oidc'); // Importa el cliente OIDC
const { generators } = require('openid-client'); // Asegúrate de importar `generators`

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Configura sesiones
    server.use(session({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: true,
    }));

    // Usa los routers definidos
    server.use('/api', imageUploadRouter);
    server.use('/api/connected-users', connectedUsersRouter);
    server.use('/api', audioUploadRouter);

    // Ruta de login OIDC
    server.get('/login', async (req, res) => {
        console.log('Iniciando autenticación OIDC...');
        const client = await getClient(); // Obtén el cliente OIDC
        const state = generators.state(); // Asegúrate de que `generators` esté importado
        const nonce = generators.nonce();
        req.session.state = state;
        req.session.nonce = nonce;

        const authorizationUrl = client.authorizationUrl({
            scope: 'openid profile email fecha_nacimiento celular offline_access',
            state,
            nonce,
            redirect_uri: 'http://localhost:3000/api/auth/callback', // Asegúrate de que sea correcto
        });

        res.redirect(authorizationUrl); // Redirige al proveedor OIDC
    });

    // Ruta de callback OIDC
    server.get('/api/auth/callback', async (req, res) => {
        const { state, nonce } = req.session || {};
        if (!state || !nonce) {
            return res.status(400).send('Error: Sesión o parámetros de autenticación no definidos.');
        }

        if (req.query.state !== state) {
            return res.status(400).send('Error: State no coincide');
        }

        const client = await getClient(); // Obtén el cliente OIDC
        const params = client.callbackParams(req);

        try {
            const tokenSet = await client.callback('http://localhost:3000/api/auth/callback', params, { nonce, state });
            const idTokenClaims = tokenSet.claims();
            console.log('Datos del usuario (id_token):', idTokenClaims);
            const userinfo = await client.userinfo(tokenSet.access_token);
            console.log('Datos del usuario (userinfo):', userinfo);

            res.send(`Tokens recibidos! Access token: ${tokenSet.access_token}`);
        } catch (error) {
            console.error('Detalles del error de intercambio de tokens:', error);
            res.status(500).send('Error en el intercambio de tokens: ' + error.message);
        }
    });

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
