import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { z, Schema } from 'zod';

import { getResourcesFactory, GetResourcesFn } from './accounting.service';

export type Pipeline = {
    name: string;
    get: GetResourcesFn;
    validationSchema: Schema;
    schema: any[];
};

const timestampSchema = z.string().transform((value?) => {
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
    validationSchema: z.object({
        JournalID: z.string(),
        JournalDate: timestampSchema,
        JournalNumber: z.number(),
        CreatedDateUTC: timestampSchema,
        JournalLines: z
            .object({
                JournalLineID: z.string(),
                AccountID: z.string(),
                AccountCode: z.string(),
                AccountType: z.string(),
                AccountName: z.string(),
                Description: z.string(),
                NetAmount: z.number(),
                GrossAmount: z.number(),
                TaxAmount: z.number(),
                TaxType: z.string(),
                TaxName: z.string(),
                TrackingCategories: z
                    .object({
                        Name: z.string(),
                        Option: z.string(),
                        TrackingCategoryID: z.string(),
                        TrackingOptionID: z.string(),
                    })
                    .array(),
            })
            .array(),
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

export const pipelines = { JOURNAL } as { [key: string]: Pipeline };
