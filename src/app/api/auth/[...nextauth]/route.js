import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Asegúrate de instalarlo con npm o yarn

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "text", type: "text", placeholder: "user@gmail.com" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        // Validación de las credenciales
        if (!credentials.email || !credentials.password) {
          throw new Error("correo y contraseña son obligatorios.");
        }

        // Buscar usuario en la base de datos
        const userFound = await db.users.findUnique({
          where: { email: credentials.email },
        });
        console.log("User Found:", userFound);
        // Si no se encuentra el usuario, lanza un error
        if (!userFound) {
          throw new Error("correo no encontrado");
        }

        // Verificar la contraseña
        const matchPassword = await bcrypt.compare(credentials.password, userFound.password);

        if (!matchPassword) {
          throw new Error("Contraseña incorrecta");
        }

        // Generar un token JWT
        const accessToken = jwt.sign(
          { id: userFound.id, role: userFound.role },
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '1w' } // El token expira en 1 semana
        );

        // Retorna solo los datos esenciales del usuario, incluyendo el token
        return {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email,
          role: userFound.role,
          accessToken, // Agrega el token aquí
        };
      },
    }),
  ],

  // Configuración de sesión
  session: {
    strategy: "jwt",  // Utiliza JWT en lugar de cookies de sesión
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Secreto para firmar el token
    maxAge: 60 * 60 * 24 * 7, // Duración del token (1 semana)
  },

  // Callbacks para personalizar el token y la sesión
  callbacks: {
    async jwt({ token, user }) {
      // Agrega información del usuario y el token al JWT
      if (user) {
        token.accessToken = user.accessToken; // Almacena el token en el JWT
        token.id = user.id;
        token.role = user.role;  
      }
      return token;
    },

    async session({ session, token }) {
      // Agrega el ID, el rol y el token de acceso a la sesión
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken; // Agrega el token a la sesión
      return session;
    },
  },

  // Páginas personalizadas
  pages: {
    signIn: "/auth/login", // Ruta de la página de inicio de sesión
  },

  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de que la variable de entorno esté definida
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
