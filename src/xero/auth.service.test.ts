import { ensureTokenSet } from './auth.service';

it('Ensure Token Set', async () => {
    return ensureTokenSet()
        .then((tokenSet) => {
            expect(tokenSet).toBeTruthy();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
});
