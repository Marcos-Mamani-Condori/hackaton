import { getClient } from '@/libs/oidc';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const client = await getClient();
    cookies().delete('access_token');
    cookies().delete('state');
    cookies().delete('nonce');

    const logoutUrl = client.endSessionUrl({
        post_logout_redirect_uri: 'http://localhost:3000/',
    });

    return NextResponse.redirect(logoutUrl);
}
