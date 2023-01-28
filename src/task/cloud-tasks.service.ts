import { CloudTasksClient, protos } from '@google-cloud/tasks';
import HttpMethod = protos.google.cloud.tasks.v2.HttpMethod;
import { v4 as uuidv4 } from 'uuid';

const LOCATION = 'us-central1';
const QUEUE = 'xero';

export const createTasks = async <P>(payloads: P[], nameFn: (p: P) => string) => {
    const client = new CloudTasksClient();

    const [projectId, serviceAccountEmail] = await Promise.all([
        client.getProjectId(),
        client.auth.getCredentials().then((credentials) => credentials.client_email),
    ]);

    const tasks = payloads.map((p) => {
        const name = client.taskPath(projectId, LOCATION, QUEUE, `${nameFn(p)}-${uuidv4()}`);

        return {
            parent: client.queuePath(projectId, LOCATION, QUEUE),
            task: {
                name,
                httpRequest: {
                    httpMethod: HttpMethod.POST,
                    headers: { 'Content-Type': 'application/json' },
                    url: (process.env.PUBLIC_URL || '') + '/pipeline',
                    oidcToken: { serviceAccountEmail },
                    body: Buffer.from(JSON.stringify(p)).toString('base64'),
                },
            },
        };
    });

    return Promise.all(tasks.map((r) => client.createTask(r))).then((requests) => requests.length);
};
