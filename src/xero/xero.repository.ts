import { XeroClient, TokenSet, TokenSetParameters } from 'xero-node';

import { getRepository } from '../firestore/firestore.service';

export const xero = new XeroClient({
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    redirectUris: [`http://localhost:8080/callback`],
    scopes: ['accounting.transactions.read', 'accounting.reports.read'],
});

export const authenticate = async () => {
    const tokenRef = getRepository('xero').doc('token');

    const tokenSet = await tokenRef
        .get()
        .then(({ data }) => data())
        .then((data: TokenSetParameters | undefined) => data && new TokenSet(data));

    if (tokenSet && !tokenSet.expired()) {
        return tokenSet;
    }

    const newTokenSet = await xero.refreshToken();
    await tokenRef.set(newTokenSet);
    return newTokenSet;
};
