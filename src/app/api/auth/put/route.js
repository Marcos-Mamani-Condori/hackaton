import { NextResponse } from 'next/server';
import db from '@/libs/db';
import bcrypt from 'bcrypt'; // Asegúrate de que bcrypt está instalado

export async function PUT(request) {
    try {
        // Obtiene los datos del usuario desde la petición
        const data = await request.json();
        
        // Asegúrate de que el nombre y el correo antiguo se envían en la solicitud
        if (!data.name || !data.oldEmail) {
            return NextResponse.json({
                message: "Name and old email are required"
            }, {
                status: 400
            });
        }

        // Verifica si el usuario existe en la base de datos usando el correo electrónico antiguo
        const user = await db.users.findUnique({ where: { email: data.oldEmail } });
        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, {
                status: 404
            });
        }

        // Verifica si el nuevo nombre de usuario ya existe
        const usernameCheck = await db.users.findUnique({
            where: { 
                name: data.name,
                NOT: { email: user.email } // No permitir que el usuario cambie su propio nombre al mismo que ya tiene
            }
        });

        if (usernameCheck) {
            return NextResponse.json({
                message: "Username already exists"
            }, {
                status: 400
            });
        }

        // Crear objeto de datos para la actualización
        const updatedData = {
            name: data.name,
            email: data.newEmail ? data.newEmail : user.email, // Actualizar el correo si se proporciona
            profile_picture_url: data.profile_picture_url // Añadir filePath aquí
        };

        // Si se proporciona una nueva contraseña, encriptarla y agregarla a la actualización
        if (data.password) {
            const salt = await bcrypt.genSalt(10); // Generar un salt
            updatedData.password = await bcrypt.hash(data.password, salt); // Encriptar la nueva contraseña
        }

        // Actualizar el usuario
        const updatedUser = await db.users.update({
            where: { email: user.email }, // Buscar por el correo electrónico antiguo
            data: updatedData,
        });
        const { password: _, ...userWithoutPassword } = updatedUser; // Excluye la contraseña del objeto de respuesta

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({
            message: error.message,
        }, {
            status: 500,
        });
    }
}
