import { http } from '@google-cloud/functions-framework';
import express from 'express';

import { xero } from './xero/xero.repository';

const app = express();

app.use('/authorize', (req, res) => {
    xero.buildConsentUrl().then((url) => res.redirect(url));
});

app.use('/', (req, res) => {
    res.json({ ok: 'ok' });
});

http('main', app);
