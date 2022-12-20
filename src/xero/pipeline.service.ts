import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

import { load } from '../bigquery/bigquery.service';
import { Pipeline } from './pipeline.const';
import { GetResourcesOptions } from './accounting.service';

export type PipelineServiceOptions = {
    'xero-tenant-id': GetResourcesOptions['xeroTenantId'];
    start?: string;
};

export const pipelineService = async (pipeline_: Pipeline, options: PipelineServiceOptions) => {
    const xeroTenantId = options['xero-tenant-id'];

    const ifModifiedSince = options.start
        ? dayjs.utc(options.start, 'YYYY-MM-DD')
        : dayjs.utc().subtract(7, 'day');

    const data = await pipeline_.get({ xeroTenantId, ifModifiedSince }).then((rows) => {
        return rows.map((row) => ({
            ...pipeline_.validationSchema.parse(row),
            XeroTenantId: xeroTenantId,
        }));
    });

    return load(data, {
        table: pipeline_.name,
        schema: [...pipeline_.schema, { name: 'XeroTenantId', type: 'STRING' }],
    });
};
