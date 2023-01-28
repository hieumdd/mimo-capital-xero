import axios from 'axios';

import { ensureTokenSet } from '../xero/auth.service';
import { JOURNAL } from './pipeline.const';
import { TENANTS } from './task.service';
import { pipelineService } from './pipeline.service';

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

describe('pipeline-service', () => {
    it.each(TENANTS)('$tenantName', async ({ tenantId }) => {
        return pipelineService(JOURNAL, { tenantId }).catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
    });
});
