import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { stringify } from 'event-stream';
import through2 from 'through2';

import { Pipeline } from './pipeline.const';
import { GetResourcesOptions } from './accounting.service';

export type PipelineServiceOptions = {
    'xero-tenant-id': GetResourcesOptions['xeroTenantId'];
    start?: string;
};

export const pipelineService = async (pipeline_: Pipeline, options: PipelineServiceOptions) => {
    const ifModifiedSince = options.start
        ? dayjs.utc(options.start)
        : dayjs.utc().subtract(7, 'day');

    return pipeline(
        await pipeline_.get({ xeroTenantId: options['xero-tenant-id'], ifModifiedSince }),
        through2.obj((data, enc, cb) => {
            cb(null, pipeline_.validationSchema.validate(data).value);
        }),
        stringify(),
        createWriteStream('x.json'),
    );
};
