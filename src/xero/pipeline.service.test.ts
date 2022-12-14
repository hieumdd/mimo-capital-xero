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
        .then((res) => res.data)
        .catch((err) => console.log(err));
});

it('Pipeline Service', async () => {
    return pipelineService(JOURNAL, {
        'xero-tenant-id': '9fb264c6-b588-4176-b547-3565402c3ed2',
        start: '2022-12-01',
    }).catch((err) => {
        console.log(err);
    });
});
