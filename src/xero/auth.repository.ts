import { TokenSet, TokenSetParameters } from 'xero-node';

import { getRepository } from '../firestore/firestore.service';

export const tokenSetRef = () => getRepository('xero').doc('token');

export const getTokenSet = async () => {
    return tokenSetRef()
        .get()
        .then((doc) => doc.data())
        .then((data: TokenSetParameters | undefined) => data && new TokenSet(data));
};

export const storeTokenSet = async (tokenSet: TokenSet) => {
    const data = {
        access_token: tokenSet.access_token,
        token_type: tokenSet.token_type,
        id_token: tokenSet.id_token,
        refresh_token: tokenSet.refresh_token,
        expires_in: tokenSet.expires_in,
        expires_at: tokenSet.expires_at,
        session_state: tokenSet.session_state,
        scope: tokenSet.scope,
    };
    return tokenSetRef().set(data);
};
