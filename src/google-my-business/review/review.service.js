"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviews = void 0;
const getReviews = async (client, { accountId, locationId }) => {
    const _get = async (pageToken) => {
        const { reviews, nextPageToken } = await client
            .request({
            url: `https://mybusiness.googleapis.com/v4/accounts/${accountId}/${locationId}/reviews`,
            params: { pageToken },
        })
            .then((res) => res.data);
        return nextPageToken
            ? [...reviews, ...(await _get(nextPageToken))]
            : reviews;
    };
    return _get().then((rows) => rows.map((row) => ({ ...row, accountId, locationId })));
};
exports.getReviews = getReviews;
//# sourceMappingURL=review.service.js.map