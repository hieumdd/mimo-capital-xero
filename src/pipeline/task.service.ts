import { createTasks } from '../task/cloud-tasks.service';
import { TaskRequestBody } from './pipeline.dto';

export const TENANTS = [
    { tenantName: 'MCAG - Mimo Capital AG', tenantId: '2d9a4a47-8c6f-494e-a90d-4d8c8b77e437' },
    { tenantName: 'TPL - TenX Pte. Ltd.', tenantId: '4d52b6d4-f227-451e-8555-d332eecc1550' },
    { tenantName: 'DeCentral DMCC', tenantId: '7c091ed1-54b4-454a-978c-84354081b215' },
    { tenantName: 'ME - Mimo Europe UAB', tenantId: '1e0ddfa8-518d-49d9-8624-90bf0f128c77' },
    {
        tenantName: 'TXH - TenX Holdings Pte. Ltd.',
        tenantId: '5af5db4c-c109-4a8b-8c90-dd0f5fd0d9ac',
    },
    { tenantName: 'DC - DeCentral Pte. Ltd.', tenantId: '610fb1b4-8cfb-42f3-a857-230545d867ca' },
    { tenantName: 'MCL - Mimo Capital Ltd.', tenantId: 'a4c50143-d20a-431c-bf5e-3de7cb98179a' },
    { tenantName: 'MI - Mimo Initiative Ltd.', tenantId: 'dc500ba5-6731-48e5-a539-4e0c2ed5e3cd' },
];

export const tasksService = ({ name, start }: TaskRequestBody) => {
    return createTasks(
        TENANTS.map(({ tenantId }) => ({ tenantId, name, start })),
        (pipeline) => [pipeline.tenantId, pipeline.name].join('-'),
    );
};
