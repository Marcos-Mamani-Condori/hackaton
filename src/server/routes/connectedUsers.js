const express = require('express');
const router = express.Router();

let connectedUsers = 0;

router.get('/', (req, res) => {
    res.json({ connectedUsers });
});

const incrementConnectedUsers = () => {
    connectedUsers++;
};

const decrementConnectedUsers = () => {
    if (connectedUsers > 0) {
        connectedUsers--;
    }
};

const getConnectedUsers = () => {
    return connectedUsers;
};

const handleusers = (socket) => {
    incrementConnectedUsers();
    console.log(`Usuario conectado. Total de usuarios: ${getConnectedUsers()}`);

    socket.on('disconnect', () => {
        decrementConnectedUsers();
        console.log(`Usuario desconectado. Total de usuarios: ${getConnectedUsers()}`);
    });
};

module.exports = {
    router,
    incrementConnectedUsers,
    decrementConnectedUsers,
    getConnectedUsers,
    handleusers,
};
