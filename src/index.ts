import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { authorizeService, callbackService } from './xero/auth.service';
import { PipelineRequestBodySchema, TaskRequestBodySchema } from './pipeline/pipeline.dto';
import * as pipelines from './pipeline/pipeline.const';
import { pipelineService } from './pipeline/pipeline.service';
import { tasksService } from './pipeline/task.service';

const app = express();

app.use('/authorize', (req, res) => {
    authorizeService().then((url) => res.redirect(url));
});

app.use('/callback', ({ url }, res) => {
    callbackService(url).then(() => res.json({ ok: 'ok' }));
});

app.use('/pipeline', ({ body }, res) => {
    PipelineRequestBodySchema.validateAsync(body)
        .then((body) => {
            pipelineService(pipelines[body.name], { tenantId: body.tenantId, start: body.start })
                .then((result) => res.status(200).json({ result }))
                .catch((err) => res.status(500).json({ err }));
        })
        .catch((err) => res.status(400).json({ err }));
});

app.use('/task', ({ body }, res) => {
    TaskRequestBodySchema.validateAsync(body)
        .then((body) => {
            tasksService(body)
                .then((result) => res.status(200).json({ result }))
                .catch((err) => res.status(500).json({ err }));
        })
        .catch((err) => res.status(400).json({ err }));
});

http('main', app);
