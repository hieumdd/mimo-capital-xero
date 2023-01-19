import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { authorizeService, callbackService } from './xero/auth.service';
import { pipelines } from './xero/pipeline.const';
import { pipelineService } from './xero/pipeline.service';
import { PipelineRequestBodySchema } from './xero/xero.dto';

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
            pipelineService(pipelines[body.name], {
                'xero-tenant-id': body['xero-tenant-id'],
                start: body.start,
            })
                .then((result) => res.status(200).json({ result }))
                .catch((err) => res.status(500).json({ err }));
        })
        .catch((err) => res.status(400).json({ err }));
});

http('main', app);
