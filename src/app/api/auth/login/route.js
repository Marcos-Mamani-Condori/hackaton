import { getClient } from '@/libs/oidc';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generators } from 'openid-client';

export async function GET() {
    const client = await getClient();
    const state = generators.state();
    const nonce = generators.nonce();

    // Guardar `state` y `nonce` en cookies
    cookies().set('state', state);
    cookies().set('nonce', nonce);

    const authorizationUrl = client.authorizationUrl({
        scope: 'openid profile email',
        state,
        nonce,
    });

    return NextResponse.redirect(authorizationUrl);
}
