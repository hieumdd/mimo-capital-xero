import { config } from 'dotenv';
config();
import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { authorizeService, callbackService } from './xero/auth.service';
import { pipelines } from './xero/pipeline.const';
import { pipelineService } from './xero/pipeline.service';

const app = express();

app.use('/authorize', (req, res) => {
    authorizeService().then((url) => res.redirect(url));
});

app.use('/callback', ({ url }, res) => {
    callbackService(url).then(() => res.json({ ok: 'ok' }));
});

app.use('/pipeline', ({ body }, res) => {
    const pipeline = pipelines[body.name];

    if (!pipeline) {
        res.status(404).json({ err: 'No Pipeline Found' });
        return;
    }

    pipelineService(pipeline, { 'xero-tenant-id': body['xero-tenant-id'], start: body.start })
        .then((result) => res.status(200).json({ result }))
        .catch((err) => res.status(500).json({ err }));
});

http('main', app);
