import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);
import Joi from 'joi';

import { load } from '../bigquery/bigquery.service';
import { Pipeline } from './pipeline.const';
import { GetResourcesOptions } from '../xero/accounting.service';

export type PipelineServiceOptions = {
    tenantId: GetResourcesOptions['tenantId'];
    start?: string;
};

export const pipelineService = async (pipeline: Pipeline, options: PipelineServiceOptions) => {
    const xeroTenantId = options.tenantId;

    const ifModifiedSince = options.start
        ? dayjs.utc(options.start, 'YYYY-MM-DD')
        : dayjs.utc().subtract(7, 'day');

    const data = await pipeline.get({ tenantId: xeroTenantId, ifModifiedSince }).then((rows) => {
        return rows.map((row) => ({
            ...Joi.attempt(row, pipeline.validationSchema, { stripUnknown: true }),
            XeroTenantId: xeroTenantId,
        }));
    });

    return load(data, {
        table: pipeline.name,
        schema: [...pipeline.schema, { name: 'XeroTenantId', type: 'STRING' }],
    });
};
