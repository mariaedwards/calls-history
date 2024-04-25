import useSWRInfinite from 'swr/infinite';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const usePaginatedFetch = (url, startDate = null, endDate = null) => {
    const getKey = (pageIndex, previousPageData) => {
        if (previousPageData && !previousPageData.next) return null;

        let query = `${url}?page=${pageIndex + 1}`;
        if (startDate) query += `&start_date=${startDate}`;
        if (endDate) query += `&end_date=${endDate}`;

        return query;
    };

    const { data, size, setSize, error } = useSWRInfinite(getKey, fetcher, {
        persistSize: true,
        revalidateFirstPage: false
    });

    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.next === null);

    return {
        data: data ? data.flatMap(page => page.results) : [],
        error,
        isLoadingMore,
        size,
        setSize,
        isReachingEnd,
    };
};
