import { XERO_CLIENT_ID, XERO_CLIENT_SECRET, xero } from './xero.repository';
import { getTokenSet, storeTokenSet } from './auth.repository';

export const authorizeService = async () => xero.buildConsentUrl();

export const callbackService = async (callbackUrl: string) => {
    return xero.apiCallback(callbackUrl).then((tokenSet) => storeTokenSet(tokenSet));
};

export const ensureTokenSet = async () => {
    const existingTokenSet = await getTokenSet();

    if (!existingTokenSet) {
        throw new Error('No Refresh Token');
    }

    if (existingTokenSet.expired()) {
        console.log('expired');
        const newTokenSet = await xero.refreshWithRefreshToken(
            XERO_CLIENT_ID,
            XERO_CLIENT_SECRET,
            existingTokenSet.refresh_token,
        );
        await storeTokenSet(newTokenSet);
        return newTokenSet;
    }

    console.log('not expired');
    return existingTokenSet;
};
