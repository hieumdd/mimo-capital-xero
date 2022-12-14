import axios from 'axios';
import { Dayjs } from 'dayjs';

import { authenticate } from './xero.repository';

const createAccountingClient = async () => {
    const tokenSet = await authenticate();

    return axios.create({
        baseURL: 'https://api.xero.com/api.xro/2.0',
        headers: { Accept: 'application/json', Authorization: `Bearer ${tokenSet.access_token}` },
    });
};

export type GetResourcesOptions = {
    path: string;
    ifModifiedSince: Dayjs;
    parseFn: (res: any) => object[];
    offsetFn: ({ offset, data }: { offset: any; data: object[] }) => any;
};

export const getResources = async (options: GetResourcesOptions) => {
    const { path, ifModifiedSince, parseFn, offsetFn } = options;

    const client = await createAccountingClient();

    const get = async (offset?: any): Promise<object[]> => {
        const data = await client
            .request({
                method: 'GET',
                url: path,
                headers: { 'If-Modified-Since': ifModifiedSince.format('YYYY-MM-DDTHH:MM:ss') },
                params: { offset },
            })
            .then(({ data }) => parseFn(data));

        return data.length > 0 ? [...data, ...(await get(offsetFn({ offset, data })))] : data;
    };

    return get();
};
