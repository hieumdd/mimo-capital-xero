import axios from 'axios';

import { ensureTokenSet } from '../xero/auth.service';
import { JOURNAL } from './pipeline.const';
import { TENANTS } from './task.service';
import { pipelineService } from './pipeline.service';

describe('pipeline-service', () => {
    it.each(TENANTS)('$tenantName', async ({ tenantId }) => {
        return pipelineService(JOURNAL, { tenantId, start: '2021-01-01' }).catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
    });
});
