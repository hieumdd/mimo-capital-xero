import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import Joi from 'joi';

import { getResourcesFactory, GetResourcesFn } from './accounting.service';

export type Pipeline = {
    name: string;
    get: GetResourcesFn;
    validationSchema: Joi.Schema;
    schema: any[];
};

const TIMESTAMP = Joi.string().custom((value?: string) => {
    if (!value) {
        return null;
    }

    const match = value.match(/(?!\()\d+(?=\+)/);

    if (!match) {
        return null;
    }

    return dayjs.utc(match[0]).toISOString();
});

export const JOURNAL: Pipeline = {
    name: 'Journals',
    get: getResourcesFactory({
        path: 'Journals',
        offsetFn: ({ data }) => ((data || []).at(-1) as any)['JournalNumber'],
    }),
    validationSchema: Joi.object({
        JournalID: Joi.string(),
        JournalDate: TIMESTAMP,
        JournalNumber: Joi.string(),
        CreatedDateUTC: TIMESTAMP,
        JournalLines: Joi.array().items(
            Joi.object({
                JournalLineID: Joi.string(),
                AccountID: Joi.string(),
                AccountCode: Joi.string(),
                AccountType: Joi.string(),
                AccountName: Joi.string(),
                Description: Joi.string(),
                NetAmount: Joi.number(),
                GrossAmount: Joi.number(),
                TaxAmount: Joi.number(),
                TaxType: Joi.string(),
                TaxName: Joi.string(),
                TrackingCategories: Joi.array().items(
                    Joi.object({
                        Name: Joi.string(),
                        Option: Joi.string(),
                        TrackingCategoryID: Joi.string(),
                        TrackingOptionID: Joi.string(),
                    }),
                ),
            }),
        ),
    }).options({ stripUnknown: true }),
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
            ],
        },
    ],
};

export const pipelines = { JOURNAL } as { [key: string]: Pipeline };
