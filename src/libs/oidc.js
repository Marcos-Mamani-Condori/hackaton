const { Issuer, generators } = require('openid-client');


let client;
module.exports.getClient = async function()  {
    if (client) return client;

    const issuer = await Issuer.discover('https://proveedor.ciudadania.demo.agetic.gob.bo');
    client = new issuer.Client({
        client_id: 'qK1W33eXykVerZbIBwSG8',
        client_secret: 'hm8RgKjm6_YsMCl3YR-imsVHTa-9U6QMgV8_pWuCZ3lGKe1OedAexGFydyCE0vjSBvkkUNnODEokhugZxzEPWQ',
        redirect_uris: ['http://localhost:3000/api/auth/callback'],
        response_types: ['code'],
    });

    return client;
}
