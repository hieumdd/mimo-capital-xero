import { ensureTokenSet } from './auth.service';
import { JOURNAL } from './pipeline.const';
import { pipelineService } from './pipeline.service';
import axios from 'axios';

it('Get Tenant ID', async () => {
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

it('Pipeline Service', async () => {
    return pipelineService(JOURNAL, {
        'xero-tenant-id': '2d9a4a47-8c6f-494e-a90d-4d8c8b77e437',
        start: '2022-01-01',
    }).catch((err) => {
        console.log(err);
    });
});
