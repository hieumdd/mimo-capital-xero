import Joi from 'joi';

import * as pipelines from './pipeline.const';

type PipelineRequestBody = {
    name: keyof typeof pipelines;
    tenantId: string;
    start?: string;
};

export const PipelineRequestBodySchema = Joi.object<PipelineRequestBody>({
    name: Joi.string()
        .valid(...Object.keys(pipelines))
        .required(),
    tenantId: Joi.string().required(),
    start: Joi.string(),
});

export type TaskRequestBody = Omit<PipelineRequestBody, 'tenantId'>;

export const TaskRequestBodySchema = Joi.object<TaskRequestBody>({
    name: Joi.string().valid(...Object.keys(pipelines)),
    start: Joi.string(),
});
