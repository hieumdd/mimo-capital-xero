import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();

export const getRepository = (repository: string) => firestore.collection(repository);
