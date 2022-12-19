import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { getResourcesFactory, GetResourcesFn } from './accounting.service';

export type Pipeline = {
    name: string;
    get: GetResourcesFn;
    transform: (e: Record<string, any>) => Record<string, any>;
    schema: any[];
};

const parseTimestamp = (value?: string) => {
    if (!value) {
        return null;
    }

    const match = value.match(/(?!\()\d+(?=\+)/);

    if (!match) {
        return null;
    }

    return dayjs.utc(+match[0]).toISOString();
};

export const JOURNAL: Pipeline = {
    name: 'Journals',
    get: getResourcesFactory({
        path: 'Journals',
        offsetFn: ({ data }) => ((data || []).at(-1) as any)['JournalNumber'],
    }),
    transform: (row) => ({
        JournalID: row.JournalID,
        JournalDate: parseTimestamp(row.JournalDate),
        JournalNumber: row.JournalNumber,
        CreatedDateUTC: parseTimestamp(row.CreatedDateUTC),
        JournalLines: (row.JournalLines || []).map((line: Record<string, any>) => ({
            JournalLineID: line.JournalLineID,
            AccountID: line.AccountID,
            AccountCode: line.AccountCode,
            AccountType: line.AccountType,
            AccountName: line.AccountName,
            Description: line.Description,
            NetAmount: line.NetAmount,
            GrossAmount: line.GrossAmount,
            TaxAmount: line.TaxAmount,
            TaxType: line.TaxType,
            TaxName: line.TaxName,
            TrackingCategories: (line.TrackingCategories || []).map(
                (trackingCategory: Record<string, any>) => ({
                    Name: trackingCategory.Name,
                    Option: trackingCategory.Option,
                    TrackingCategoryID: trackingCategory.TrackingCategoryID,
                    TrackingOptionID: trackingCategory.TrackingOptionID,
                }),
            ),
        })),
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
