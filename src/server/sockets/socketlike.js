const jwt = require('jsonwebtoken');
const prisma = require('./../../libs/db');

const registerLikes = (socket, io) => {

        // Manejo del evento para dar like a una pregunta
        socket.on("like_pregunta", async (data) => {
            const { messageId, username, token } = data;

            if (!token) {
                console.error('Token no proporcionado');
                return;
            }

            try {
                const secret = process.env.NEXTAUTH_SECRET;
                const decoded = jwt.verify(token, secret);
                const authenticatedUserId = decoded.id;

                if (!authenticatedUserId) {
                    console.error('Usuario no autenticado');
                    return;
                }

                // Verificar el ID del usuario basado en el username
                const user = await prisma.users.findUnique({
                    where: { name: username },
                    select: { id: true },
                });

                if (!user) {
                    console.error('UserId no encontrado para el username:', username);
                    return;
                }

                const userId = user.id;

                // Usar transacción para manejar la creación y eliminación de likes
                const result = await prisma.$transaction(async (tx) => {
                    const existingLike = await tx.likes.findFirst({
                        where: {
                            message_id: messageId,
                            user_id: authenticatedUserId, // Verificar el like dado por el usuario autenticado
                        },
                    });

                    if (existingLike) {
                        // Si ya dio like, eliminarlo
                        await tx.likes.delete({
                            where: { id: existingLike.id },
                        });
                        console.log(`Like eliminado para el messageId: ${messageId} por el usuario: ${authenticatedUserId}`);
                        return 'removed'; // Indica que se eliminó un like
                    } else {
                        // Si no ha dado like, crear uno nuevo
                        await tx.likes.create({
                            data: {
                                message_id: messageId,
                                user_id: authenticatedUserId, // Guardar el ID del usuario que dio el like
                            },
                        });
                        console.log(`Nuevo like agregado por el usuario con ID: ${authenticatedUserId}`);
                        return 'added'; // Indica que se agregó un like
                    }
                });

                // Contar los likes totales para esta pregunta
                const totalLikes = await prisma.likes.count({
                    where: { message_id: messageId },
                });

                // Emitir el nuevo total de likes a todos los clientes
                io.emit("like_added", { messageId, totalLikes, action: result });

            } catch (error) {
                console.error('Error al manejar like:', error);
            }
        });

        // Manejo del evento para obtener el conteo de likes
        socket.on("get_like_count", async (messageId) => {
            try {
                const totalLikes = await prisma.likes.count({
                    where: { message_id: messageId },
                });
                socket.emit("like_count_response", { preguntas_id: messageId, total_likes: totalLikes });
            } catch (error) {
                console.error('Error al obtener el contador de likes:', error);
            }
        });

        // Manejo del evento para verificar si el usuario ha dado like
        socket.on("check_user_like", async ({ messageId, token }) => {
            try {
                const secret = process.env.NEXTAUTH_SECRET;
                const decoded = jwt.verify(token, secret);
                const authenticatedUserId = decoded.id;

                const existingLike = await prisma.likes.findFirst({
                    where: {
                        message_id: messageId,
                        user_id: authenticatedUserId, // Verificar el like dado por el usuario autenticado
                    },
                });

                const hasLiked = existingLike !== null;
                socket.emit("user_like_status", { preguntas_id: messageId, has_liked: hasLiked });

            } catch (error) {
                console.error('Error al comprobar el estado de like del usuario:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    };

    console.log('Sockets de likes configurados y escuchando');
;

module.exports = registerLikes;
