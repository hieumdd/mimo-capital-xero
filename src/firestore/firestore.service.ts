import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore({ ignoreUndefinedProperties: true });

export const getRepository = (repository: string) => firestore.collection(repository);
