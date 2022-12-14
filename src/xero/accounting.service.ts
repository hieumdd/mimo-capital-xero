import { Readable } from 'node:stream';
import axios from 'axios';
import { Dayjs } from 'dayjs';

import { ensureTokenSet } from './auth.service';

const createAccountingClient = async (xeroTenantId: string) => {
    const tokenSet = await ensureTokenSet();

    const client = axios.create({ baseURL: 'https://api.xero.com/api.xro/2.0' });

    client.interceptors.request.use((request) => {
        request.headers = {
            ...request.headers,
            Accept: 'application/json',
            Authorization: `Bearer ${tokenSet.access_token}`,
            'Xero-tenant-id': xeroTenantId,
        };
        return request;
    });

    return client;
};

export type GetResourcesOptions = {
    xeroTenantId: string;
    ifModifiedSince: Dayjs;
};

export type GetResourcesFactoryOptions = {
    path: string;
    offsetFn: ({ offset, data }: { offset: any; data: object[] }) => any | undefined;
};

export type GetResourcesFn = (options: GetResourcesOptions) => Promise<object[]>;

export const getResourcesFactory = (factoryOptions: GetResourcesFactoryOptions) => {
    return async (options: GetResourcesOptions) => {
        const client = await createAccountingClient(options.xeroTenantId);

        const get = async (offset?: any): Promise<object[]> => {
            const data = await client
                .request({
                    method: 'GET',
                    url: `/${factoryOptions.path}`,
                    headers: {
                        'If-Modified-Since': options.ifModifiedSince.format('YYYY-MM-DDTHH:MM:ss'),
                    },
                    params: { offset },
                })
                .then(({ data }) => data[factoryOptions.path]);

            return data.length > 0
                ? [...data, ...(await get(factoryOptions.offsetFn({ offset, data })))]
                : data;
        };

        return get();
    };
};
