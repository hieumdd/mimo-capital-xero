"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../auth/auth.service");
const review_service_1 = require("./review.service");
describe('Review', () => {
    let client;
    const accountId = `102502012296490759042`;
    const locationId = `1118203103520952847`;
    beforeAll(async () => {
        client = await (0, auth_service_1.getAuthClient)();
    });
    it('Get Reviews', async () => {
        return (0, review_service_1.getReviews)(client, { accountId, locationId })
            .then((reviews) => {
            console.log(reviews);
            reviews.forEach((review) => {
                expect(review).toBeTruthy();
            });
        })
            .catch((err) => {
            console.log(err);
        });
    });
});
//# sourceMappingURL=review.service.test.js.map