import Joi from 'joi';

import { pipelines } from './pipeline.const';

type PipelineRequestBody = {
    name: keyof typeof pipelines;
    'xero-tenant-id': string;
    start: string;
};

export const PipelineRequestBodySchema = Joi.object<PipelineRequestBody>({
    name: Joi.string()
        .valid(...Object.keys(pipelines))
        .required(),
    'xero-tenant-id': Joi.string().required(),
    start: Joi.string(),
});
