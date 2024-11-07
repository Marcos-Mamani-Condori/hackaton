import { NextResponse } from 'next/server'
import db from '@/libs/db'
import bcrypt from 'bcrypt'
export async function POST(request) {
    try {
        const data = await request.json();

    const userFound = await db.users.findUnique({
        where: { 
            email: data.email
        }
    })
    if (userFound){
        return NextResponse.json({
            message: "email already exists "
        }, {
            status: 400
        })
    }
    const usernameFound = await db.users.findUnique({
        where: { 
            name: data.name
        }
    })
    if (usernameFound){
        return NextResponse.json({
            message: "username already exists "
        }, {
            status: 400
        })
    }
const hashedPassword = await bcrypt.hash(data.password, 10 )
const newUser = await db.users.create({
        data: {
            password: hashedPassword,
            name: data.name,
            email: data.email,
            profile_picture_url: data.profile_picture_url || 'no',
            major: data.major, 
            role: data.role || 'registrado', 
        }
    }
)
const {password: _, ...users}=newUser
console.log("users:", JSON.stringify(users, null, 2)); 
     return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            {
            message: error.message,
        },
        {
            status: 500,
        }
    );
    }
}