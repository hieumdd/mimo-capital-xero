import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import Joi, { Schema } from 'joi';

import { getResourcesFactory } from '../xero/accounting.service';

export type Pipeline = {
    name: string;
    get: ReturnType<typeof getResourcesFactory>;
    validationSchema: Schema;
    schema: any[];
};

const timestampSchema = Joi.string().custom((value) => {
    if (!value) {
        return null;
    }

    const match = value.match(/(?!\()\d+(?=\+)/);

    if (!match) {
        return null;
    }

    return dayjs.utc(+match[0]).toISOString();
});

export const JOURNAL: Pipeline = {
    name: 'Journals',
    get: getResourcesFactory({
        path: 'Journals',
        offsetFn: ({ data }) => ((data || []).at(-1) as any)['JournalNumber'],
    }),
    validationSchema: Joi.object({
        JournalID: Joi.string(),
        JournalDate: timestampSchema,
        JournalNumber: Joi.number(),
        CreatedDateUTC: timestampSchema,
        JournalLines: Joi.array().items({
            JournalLineID: Joi.string(),
            AccountID: Joi.string(),
            AccountCode: Joi.string(),
            AccountType: Joi.string(),
            AccountName: Joi.string(),
            Description: Joi.string().allow(''),
            NetAmount: Joi.number(),
            GrossAmount: Joi.number(),
            TaxAmount: Joi.number(),
            TaxType: Joi.string(),
            TaxName: Joi.string(),
            TrackingCategories: Joi.array().items({
                Name: Joi.string(),
                Option: Joi.string(),
                TrackingCategoryID: Joi.string(),
                TrackingOptionID: Joi.string(),
            }),
        }),
    }),
    schema: [
        { name: 'JournalID', type: 'STRING' },
        { name: 'JournalDate', type: 'TIMESTAMP' },
        { name: 'JournalNumber', type: 'NUMERIC' },
        { name: 'CreatedDateUTC', type: 'TIMESTAMP' },
        {
            name: 'JournalLines',
            type: 'RECORD',
            mode: 'REPEATED',
            fields: [
                { name: 'JournalLineID', type: 'STRING' },
                { name: 'AccountID', type: 'STRING' },
                { name: 'AccountCode', type: 'STRING' },
                { name: 'AccountType', type: 'STRING' },
                { name: 'AccountName', type: 'STRING' },
                { name: 'Description', type: 'STRING' },
                { name: 'NetAmount', type: 'NUMERIC' },
                { name: 'GrossAmount', type: 'NUMERIC' },
                { name: 'TaxAmount', type: 'NUMERIC' },
                { name: 'TaxType', type: 'STRING' },
                { name: 'TaxName', type: 'STRING' },
                {
                    name: 'TrackingCategories',
                    type: 'RECORD',
                    mode: 'REPEATED',
                    fields: [
                        { name: 'Name', type: 'STRING' },
                        { name: 'Option', type: 'STRING' },
                        { name: 'TrackingCategoryID', type: 'STRING' },
                        { name: 'TrackingOptionID', type: 'STRING' },
                    ],
                },
            ],
        },
    ],
};
