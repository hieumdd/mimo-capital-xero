import { XeroClient } from 'xero-node';

export const XERO_CLIENT_ID = process.env.XERO_CLIENT_ID || '';
export const XERO_CLIENT_SECRET = process.env.XERO_CLIENT_SECRET || '';

export const xero = new XeroClient({
    clientId: XERO_CLIENT_ID,
    clientSecret: XERO_CLIENT_SECRET,
    redirectUris: [`${process.env.PUBLIC_URL}/callback`],
    scopes: [
        'accounting.transactions.read',
        'accounting.reports.read',
        'accounting.budgets.read',
        'accounting.journals.read',
        'offline_access',
    ],
    httpTimeout: 10_000,
});
