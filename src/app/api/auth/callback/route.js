import { getClient } from '@/libs/oidc';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const client = await getClient();
    const cookieState = cookies().get('state');
    const cookieNonce = cookies().get('nonce');
    const params = client.callbackParams(new URL(req.url));

    if (params.state !== cookieState || !cookieNonce) {
        return new Response('Error de autenticación', { status: 400 });
    }

    try {
        const tokenSet = await client.callback('http://localhost:3000/api/auth/callback', params, {
            nonce: cookieNonce,
            state: cookieState,
        });
        cookies().set('access_token', tokenSet.access_token);

        return NextResponse.redirect('/');
    } catch (error) {
        console.error('Error en el intercambio de tokens:', error);
        return new Response('Error en el intercambio de tokens', { status: 500 });
    }
}
