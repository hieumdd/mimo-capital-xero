import { createTasks } from '../task/cloud-tasks.service';
import { TaskRequestBody } from './pipeline.dto';

export const TENANTS = [
    { tenantName: 'MCAG - Mimo Capital AG', tenantId: '2d9a4a47-8c6f-494e-a90d-4d8c8b77e437' },
    { tenantName: 'TPL - TenX Pte. Ltd.', tenantId: '4d52b6d4-f227-451e-8555-d332eecc1550' },
    { tenantName: 'DeCentral DMCC', tenantId: '7c091ed1-54b4-454a-978c-84354081b215' },
];

export const tasksService = ({ name, start }: TaskRequestBody) => {
    return createTasks(
        TENANTS.map(({ tenantId }) => ({ tenantId, name, start })),
        (pipeline) => [pipeline.tenantId, pipeline.name].join('-'),
    );
};
