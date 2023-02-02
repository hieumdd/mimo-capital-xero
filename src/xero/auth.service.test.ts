import axios from 'axios';

import { ensureTokenSet } from './auth.service';

it('ensure-token-set', async () => {
    return ensureTokenSet()
        .then((tokenSet) => {
            expect(tokenSet).toBeTruthy();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
});

it('get-tenants', async () => {
    const tokenSet = await ensureTokenSet();

    return axios
        .request({
            url: 'https://api.xero.com/connections',
            headers: { Authorization: `Bearer ${tokenSet.access_token}` },
        })
        .then(({ data }) => {
            console.log(data);
            expect(data).toBeTruthy();
        })
        .catch((err) => {
            console.log(err);
        });
});
