import { RouteDetails } from '../../types';

export default (routeDetails: RouteDetails) => {
    // If the user decided to set a custom timeout we will use it.
    if (routeDetails?.executionTime > 0 && !global.aspectoMetadata.didSetTimeout) {
        return Math.ceil(routeDetails.executionTime / 1000) * 1000;
    } else {
        return global.aspectoOptions.timeout;
    }
};
