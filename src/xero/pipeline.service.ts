import fs from 'fs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { Pipeline } from './pipeline.const';
import { getResources } from './xero.service';

export const pipelineService = async (pipeline: Pipeline, _ifModifiedSince?: string) => {
    const ifModifiedSince = _ifModifiedSince
        ? dayjs.utc(_ifModifiedSince)
        : dayjs.utc().subtract(7, 'day');

    const data = await getResources({ ...pipeline, ifModifiedSince });

    fs.writeFileSync('x.json', JSON.stringify(data));
};
