import axios from 'axios';
import axiosThrottle from 'axios-request-throttle';
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

    axiosThrottle.use(client, { requestsPerSecond: 1 });

    return client;
};

export type GetResourcesOptions = {
    tenantId: string;
    ifModifiedSince: Dayjs;
};

export type GetResourcesFactoryOptions = {
    path: string;
    offsetFn: ({ offset, data }: { offset: any; data: object[] }) => any | undefined;
};

export const getResourcesFactory = (factoryOptions: GetResourcesFactoryOptions) => {
    return async (options: GetResourcesOptions) => {
        const client = await createAccountingClient(options.tenantId);

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
